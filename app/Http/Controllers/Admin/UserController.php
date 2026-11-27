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
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    private const ROLES = ['admin', 'guru', 'siswa', 'mahasiswa'];

    public function index(Request $request): Response
    {
        $q = trim($request->validate([
            'q' => ['nullable', 'string', 'max:60'],
        ])['q'] ?? '');

        $like = '%'.addcslashes($q, '%_\\').'%';

        $users = User::query()
            ->when($q !== '', fn ($query) => $query->where(function ($w) use ($like) {
                $w->where('name', 'like', $like)
                    ->orWhere('identifier', 'like', $like)
                    ->orWhere('email', 'like', $like);
            }))
            ->latest('id')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (User $u) => $u->only('id', 'name', 'role', 'identifier', 'email'));

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'filters' => ['q' => $q],
            'stats' => User::query()
                ->selectRaw('role, count(*) as total')
                ->groupBy('role')
                ->pluck('total', 'role'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $clean = fn ($v) => is_string($v) && trim($v) !== '' ? trim($v) : null;
        $email = $clean($request->input('email'));

        $request->merge([
            'email' => $email ? Str::lower($email) : null,
            'identifier' => $clean($request->input('identifier')),
        ]);

        $isAdmin = fn () => $request->input('role') === 'admin';

        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'role' => ['required', Rule::in(self::ROLES)],
            'identifier' => [
                Rule::requiredIf(fn () => ! $isAdmin()),
                'nullable', 'string', 'max:40', 'regex:/^[A-Za-z0-9._-]+$/',
                'unique:users,identifier',
            ],
            'email' => [
                Rule::requiredIf($isAdmin),
                'nullable', 'email:rfc', 'max:255', 'unique:users,email',
            ],
            'password' => ['nullable', 'string', Password::defaults()],
        ], [
            'required' => ':attribute wajib diisi.',
            'unique' => ':attribute sudah terdaftar.',
            'email' => 'Masukkan email yang valid.',
            'identifier.regex' => 'ID hanya boleh berisi huruf, angka, titik, garis bawah, dan strip.',
            'password.min' => 'Kata sandi minimal 8 karakter.',
            'password.mixed' => 'Kata sandi harus memuat huruf besar dan kecil.',
            'password.numbers' => 'Kata sandi harus memuat angka.',
        ], [
            'name' => 'Nama',
            'identifier' => 'NIS / NIM / NIP',
            'email' => 'Email',
        ]);

        $generated = blank($data['password'] ?? null);
        $plain = $generated ? Str::password(14, symbols: false) : $data['password'];

        $user = new User();
        $user->forceFill([
            'name' => $data['name'],
            'role' => $data['role'],
            'identifier' => $data['identifier'] ?? null,
            'email' => $data['email'] ?? null,
            'password' => Hash::make($plain),
            'must_change_password' => true,
        ])->save();

        Log::info('Akun dibuat admin', [
            'by' => $request->user()->id,
            'user' => $user->id,
            'role' => $user->role,
        ]);

        $flash = ['success' => "Akun {$user->name} berhasil dibuat."];

        if ($generated) {
            $flash['generated'] = [
                'name' => $user->name,
                'login' => $user->identifier ?? $user->email,
                'password' => $plain,
            ];
        }

        return back()->with($flash);
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