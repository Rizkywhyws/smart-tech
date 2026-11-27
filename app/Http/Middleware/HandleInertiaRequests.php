<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => fn () => $request->user()?->only('id', 'name', 'role', 'identifier', 'email'),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'generated' => fn () => $request->session()->get('generated'),
            ],
        ];
    }
}