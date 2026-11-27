<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PasswordController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn() => Inertia::render('LandingPage'))->name('home');

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');

    Route::post('/login', [AuthController::class, 'login'])
        ->middleware('throttle:30,1');

    Route::post('/register-admin', [AuthController::class, 'registerAdmin'])
        ->middleware('throttle:5,1')
        ->name('register.admin');
});

Route::middleware(['auth', 'auth.session'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::get('/ganti-sandi', [PasswordController::class, 'edit'])->name('password.change');
    Route::put('/ganti-sandi', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('password.change.update');

    Route::middleware('password.changed')->group(function () {
        Route::get('/dashboard', DashboardController::class)->name('dashboard');

        Route::middleware('role:admin')->prefix('admin')->group(function () {
            Route::get('/pengguna', [UserController::class, 'index'])->name('admin.users');
            Route::post('/pengguna', [UserController::class, 'store']);
            Route::put('/pengguna/{user}/password', [UserController::class, 'resetPassword']);
            Route::delete('/pengguna/{user}', [UserController::class, 'destroy']);
        });
    });
});
