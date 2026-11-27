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

        if ($user->role === 'admin') {
            return redirect()->route('admin.users');
        }

        return Inertia::render('Dashboard', [
            'user' => $user->only('name', 'role', 'identifier', 'email'),
        ]);
    }
}