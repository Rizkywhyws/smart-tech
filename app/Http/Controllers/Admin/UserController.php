<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    private const ROLES = ['admin', 'guru', 'siswa'];

    public function index(Request $request): Response
    {
        $data = $request->validate([
            'q' => ['nullable', 'string', 'max:60'],
            'role' => ['nullable', Rule::in(self::ROLES)],
            'status' => ['nullable', Rule::in(['aktif', 'menunggu'])],
            'sort' => ['nullable', Rule::in(['name', 'identifier', 'role', 'created_at'])],
            'dir' => ['nullable', Rule::in(['asc', 'desc'])],
            'per_page' => ['nullable', Rule::in(['10', '25', '50', '100'])],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        $q = trim($data['q'] ?? '');
        $role = $data['role'] ?? '';
        $status = $data['status'] ?? '';
        $sort = $data['sort'] ?? 'created_at';
        $dir = $data['dir'] ?? 'desc';
        $perPage = (int) ($data['per_page'] ?? 10);
        $like = '%' . addcslashes($q, '%_\\') . '%';

        $paginator = User::query()
            ->select([
                'id',
                'name',
                'role',
                'identifier',
                'email',
                'must_change_password',
                'created_at',
                'updated_at',
            ])
            ->whereIn('role', self::ROLES)
            ->when($q !== '', fn($query) => $query->where(function ($w) use ($like) {
                $w->where('name', 'like', $like)
                    ->orWhere('identifier', 'like', $like)
                    ->orWhere('email', 'like', $like);
            }))
            ->when($role !== '', fn($query) => $query->where('role', $role))
            ->when($status === 'menunggu', fn($query) => $query->where('must_change_password', true))
            ->when($status === 'aktif', fn($query) => $query->where('must_change_password', false))
            ->orderBy($sort, $dir)
            ->orderBy('id', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        $sessions = DB::table('sessions')
            ->whereIn('user_id', $paginator->getCollection()->pluck('id'))
            ->selectRaw('user_id, count(*) as total, max(last_activity) as last_activity')
            ->groupBy('user_id')
            ->get()
            ->keyBy('user_id');

        $users = $paginator->through(function (User $u) use ($sessions) {
            $s = $sessions->get($u->id);

            return [
                'id' => $u->id,
                'name' => $u->name,
                'role' => $u->role,
                'identifier' => $u->identifier,
                'email' => $u->email,
                'must_change_password' => (bool) $u->must_change_password,
                'created_at' => $u->created_at?->toIso8601String(),
                'updated_at' => $u->updated_at?->toIso8601String(),
                'sessions' => (int) ($s->total ?? 0),
                'last_active' => $s
                    ? Carbon::createFromTimestamp($s->last_activity)->toIso8601String()
                    : null,
            ];
        });

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'filters' => [
                'q' => $q,
                'role' => $role,
                'status' => $status,
                'sort' => $sort,
                'dir' => $dir,
                'per_page' => $perPage,
            ],
            'stats' => User::roleCounts(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'role' => ['required', Rule::in(self::ROLES)],
            'identifier' => ['nullable', 'string', 'max:40', 'unique:users,identifier'],
            'email' => ['nullable', 'email', 'max:255', 'unique:users,email'],
            'password' => ['nullable', 'string', Password::defaults()],
        ]);

        $data['name'] = trim($data['name']);

        $data['email'] = filled($data['email'] ?? null)
            ? strtolower(trim($data['email']))
            : null;

        $data['identifier'] = filled($data['identifier'] ?? null)
            ? trim($data['identifier'])
            : null;

        $password = filled($data['password'] ?? null)
            ? $data['password']
            : Str::password(14, symbols: false);

        $user = new User();

        $user->forceFill([
            'id' => User::makeId($data['role']),
            'name' => $data['name'],
            'role' => $data['role'],
            'identifier' => $data['identifier'],
            'email' => $data['email'],
            'password' => Hash::make($password),
            'must_change_password' => true,
        ])->save();

        Log::info('Akun dibuat admin', [
            'by' => $request->user()->id,
            'user' => $user->id,
            'role' => $user->role,
        ]);

        return back()->with('success', [
            'message' => 'Akun berhasil dibuat.',
            'credentials' => [
                'id' => $user->id,
                'password' => $password,
            ],
        ]);
    }

    public function resetPassword(Request $request, User $user): RedirectResponse
    {
        $plain = Str::password(14, symbols: false);

        $user->forceFill([
            'password' => Hash::make($plain),
            'must_change_password' => true,
            'remember_token' => Str::random(60),
        ])->save();

        $this->endSessions($user);

        Log::info('Sandi direset admin', ['by' => $request->user()->id, 'user' => $user->id]);

        return back()->with([
            'success' => "Kata sandi {$user->name} direset.",
            'generated' => [
                'name' => $user->name,
                'login' => $user->identifier ?? $user->email,
                'password' => $plain,
            ],
        ]);
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        abort_if($request->user()->is($user), 403, 'Tidak dapat menghapus akun sendiri.');

        abort_if(
            $user->role === 'admin' && User::where('role', 'admin')->count() <= 1,
            403,
            'Admin terakhir tidak dapat dihapus.'
        );

        $name = $user->name;

        $this->endSessions($user);
        $user->delete();

        Log::info('Akun dihapus admin', ['by' => $request->user()->id, 'user' => $user->id]);

        return back()->with('success', "Akun {$name} dihapus.");
    }

    private function endSessions(User $user): void
    {
        DB::table('sessions')->where('user_id', $user->id)->delete();
    }
}
