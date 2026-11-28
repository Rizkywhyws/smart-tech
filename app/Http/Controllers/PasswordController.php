<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class PasswordController extends Controller
{
    public function edit(Request $request): Response
    {
        return Inertia::render('ChangePassword', [
            'forced' => (bool) $request->user()->must_change_password,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', 'different:current_password', Password::defaults()],
        ], [
            'current_password.required' => 'Masukkan kata sandi saat ini.',
            'current_password.current_password' => 'Kata sandi saat ini salah.',
            'password.required' => 'Masukkan kata sandi baru.',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok.',
            'password.different' => 'Kata sandi baru harus berbeda dari yang lama.',
            'password.min' => 'Kata sandi minimal 8 karakter.',
            'password.mixed' => 'Kata sandi harus memuat huruf besar dan kecil.',
            'password.numbers' => 'Kata sandi harus memuat angka.',
        ]);

        $user = $request->user();

        $user->forceFill([
            'password' => $data['password'], 
            'must_change_password' => false,
        ])->save();

        Auth::logoutOtherDevices($data['password']);
        $request->session()->regenerate();

        return redirect()->route('dashboard')->with('success', 'Kata sandi berhasil diganti.');
    }
}