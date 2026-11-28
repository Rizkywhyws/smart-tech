<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        return match ($user->role) {
            'admin' => redirect()->route('admin.dashboard'),
            'guru' => Inertia::render('Teacher/Dashboard', [
                'user' => $this->userProps($user),
            ]),
            default => Inertia::render('Student/DashboardStudent', [
                'user' => $this->userProps($user),
            ]),
        };
    }

    private function userProps($user): array
    {
        return [
            'name' => $user->name,
            'role' => $user->role,
            'email' => $user->email,
            'identifier' => $user->id,
        ];
    }
}
