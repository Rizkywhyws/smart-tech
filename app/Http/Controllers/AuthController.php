<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Contracts\Cache\LockTimeoutException;

class AuthController extends Controller
{
    public function showLogin(): Response
    {
        return Inertia::render('Login', [
            'canRegisterAdmin' => ! User::where('role', 'admin')->exists(),
        ]);
    }

    public function login(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'identity' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string', 'max:255'],
        ], [
            'identity.required' => 'Masukkan NIS, NIM, NIP, atau email Anda.',
            'password.required' => 'Masukkan kata sandi Anda.',
        ]);

        $identity = trim($data['identity']);
        $ip = $request->ip();

        $perAccount = 'login:' . Str::lower($identity) . '|' . $ip;
        $perIp = 'login-ip:' . $ip;

        if (RateLimiter::tooManyAttempts($perAccount, 5) || RateLimiter::tooManyAttempts($perIp, 20)) {
            $seconds = max(RateLimiter::availableIn($perAccount), RateLimiter::availableIn($perIp));

            throw ValidationException::withMessages([
                'identity' => "Terlalu banyak percobaan. Coba lagi dalam {$seconds} detik.",
            ]);
        }

        $user = User::where('identifier', $identity)
            ->orWhere('email', Str::lower($identity))
            ->first();

        if ($user) {
            $valid = Hash::check($data['password'], $user->password);
        } else {
            Hash::make($data['password']);
            $valid = false;
        }

        if (! $valid) {
            RateLimiter::hit($perAccount, 60);
            RateLimiter::hit($perIp, 60);

            Log::warning('Login gagal', [
                'ip' => $ip,
                'id_hash' => substr(hash('sha256', Str::lower($identity)), 0, 12),
            ]);

            throw ValidationException::withMessages([
                'identity' => 'NIS/NIM/NIP/email atau kata sandi salah.',
            ]);
        }

        RateLimiter::clear($perAccount);

        if (Hash::needsRehash($user->password)) {
            $user->forceFill(['password' => Hash::make($data['password'])])->save();
        }

        Auth::login($user, $request->boolean('remember'));
        $request->session()->regenerate(); 

        return redirect()->intended(route('dashboard'));
    }

    public function registerAdmin(Request $request): RedirectResponse
    {
        abort_if(
            User::where('role', 'admin')->exists(),
            403,
            'Admin sudah terdaftar. Minta admin untuk membuatkan akun.'
        );

        if (is_string($request->input('email'))) {
            $request->merge(['email' => Str::lower(trim($request->input('email')))]);
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email:rfc', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'confirmed', Password::defaults()],
        ], [
            'required' => ':attribute wajib diisi.',
            'email.email' => 'Masukkan email yang valid.',
            'email.unique' => 'Email sudah terdaftar.',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok.',
            'password.min' => 'Kata sandi minimal 8 karakter.',
            'password.mixed' => 'Kata sandi harus memuat huruf besar dan kecil.',
            'password.numbers' => 'Kata sandi harus memuat angka.',
        ], [
            'name' => 'Nama lengkap',
            'email' => 'Email',
            'password' => 'Kata sandi',
        ]);

        try {
            $user = Cache::lock('register-admin', 10)->block(5, function () use ($data) {
                abort_if(
                    User::where('role', 'admin')->exists(),
                    403,
                    'Admin sudah terdaftar. Minta admin untuk membuatkan akun.'
                );

                $user = new User();
                $user->forceFill([
                    'name' => trim($data['name']),
                    'email' => $data['email'],
                    'role' => 'admin',
                    'password' => Hash::make($data['password']),
                ])->save();

                return $user;
            });
        } catch (LockTimeoutException) {
            abort(429, 'Server sedang sibuk, coba lagi sebentar.');
        }

        Log::info('Admin pertama terdaftar', ['user' => $user->id, 'ip' => $request->ip()]);

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('dashboard');
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
