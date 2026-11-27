<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $counts = User::query()
            ->selectRaw('role, count(*) as total')
            ->groupBy('role')
            ->pluck('total', 'role');

        $recent = User::query()
            ->latest('id')
            ->take(6)
            ->get()
            ->map(fn (User $u) => [
                'id' => $u->id,
                'name' => $u->name,
                'role' => $u->role,
                'at' => $u->created_at?->diffForHumans(),
            ]);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total' => (int) $counts->sum(),
                'siswa' => (int) ($counts['siswa'] ?? 0),
                'mahasiswa' => (int) ($counts['mahasiswa'] ?? 0),
                'guru' => (int) ($counts['guru'] ?? 0),
                'admin' => (int) ($counts['admin'] ?? 0),
                'thisWeek' => User::where('created_at', '>=', now()->subDays(7))->count(),
            ],
            'recent' => $recent,
        ]);
    }
}