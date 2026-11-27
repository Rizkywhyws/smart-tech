<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthSecurityTest extends TestCase
{
    use RefreshDatabase;

    private function makeUser(string $role = 'siswa', array $extra = []): User
    {
        $user = new User();
        $user->forceFill(array_merge([
            'name' => 'Uji Coba',
            'role' => $role,
            'identifier' => '2026104011',
            'password' => Hash::make('Rahasia123'),
        ], $extra))->save();

        return $user;
    }

    public function test_login_benar_berhasil(): void
    {
        $this->makeUser();

        $this->post('/login', ['identity' => '2026104011', 'password' => 'Rahasia123'])
            ->assertRedirect(route('dashboard'));

        $this->assertAuthenticated();
    }

    public function test_payload_sql_injection_ditolak(): void
    {
        $this->makeUser();

        foreach (["' OR '1'='1", "2026104011' --", '" OR ""="', "x'; DROP TABLE users; --"] as $payload) {
            $this->post('/login', ['identity' => $payload, 'password' => $payload])
                ->assertSessionHasErrors('identity');

            $this->assertGuest();
        }

        $this->assertDatabaseCount('users', 1);
    }

    public function test_siswa_tidak_bisa_membuka_panel_admin(): void
    {
        $this->actingAs($this->makeUser())
            ->get('/admin/pengguna')
            ->assertForbidden();
    }

    public function test_admin_pertama_bisa_mendaftar_tanpa_kode(): void
    {
        $this->post('/register-admin', [
            'name' => 'Admin Satu',
            'email' => 'Admin@Contoh.ac.id',
            'password' => 'Rahasia123',
            'password_confirmation' => 'Rahasia123',
        ])->assertRedirect(route('dashboard'));

        $this->assertDatabaseHas('users', ['email' => 'admin@contoh.ac.id', 'role' => 'admin']);
        $this->assertAuthenticated();
    }

    public function test_pendaftaran_ditutup_setelah_ada_admin(): void
    {
        $this->makeUser('admin', ['identifier' => null, 'email' => 'a@contoh.ac.id']);

        $this->post('/register-admin', [
            'name' => 'Admin Dua',
            'email' => 'dua@contoh.ac.id',
            'password' => 'Rahasia123',
            'password_confirmation' => 'Rahasia123',
        ])->assertForbidden();

        $this->assertDatabaseMissing('users', ['email' => 'dua@contoh.ac.id']);
    }

    public function test_role_tidak_bisa_dipalsukan_lewat_input(): void
    {
        $this->post('/register-admin', [
            'name' => 'Admin Satu',
            'email' => 'admin@contoh.ac.id',
            'password' => 'Rahasia123',
            'password_confirmation' => 'Rahasia123',
            'role' => 'siswa',
        ]);

        $this->assertDatabaseHas('users', ['email' => 'admin@contoh.ac.id', 'role' => 'admin']);
    }

    public function test_input_berbahaya_saat_daftar_ditolak_atau_disimpan_aman(): void
    {
        $this->post('/register-admin', [
            'name' => "Robert'); DROP TABLE users;--",
            'email' => "x' OR '1'='1",
            'password' => 'Rahasia123',
            'password_confirmation' => 'Rahasia123',
        ])->assertSessionHasErrors('email');

        $this->assertDatabaseCount('users', 0);
    }


    public function test_pengguna_dengan_sandi_sementara_dipaksa_ganti(): void
    {
        $this->actingAs($this->makeUser('siswa', ['must_change_password' => true]))
            ->get('/dashboard')
            ->assertRedirect(route('password.change'));
    }

    public function test_pencarian_dengan_payload_aneh_tidak_error(): void
    {
        $admin = $this->makeUser('admin', ['identifier' => null, 'email' => 'a@contoh.ac.id']);

        $this->actingAs($admin)
            ->get('/admin/pengguna?q=' . urlencode("%' OR 1=1 --"))
            ->assertOk();
    }

    public function test_login_dibatasi_setelah_5_kali_salah(): void
    {
        $this->makeUser();

        for ($i = 0; $i < 5; $i++) {
            $this->post('/login', ['identity' => '2026104011', 'password' => 'Salah123']);
        }

        // Percobaan ke-6 ditolak walau sandinya benar.
        $this->post('/login', ['identity' => '2026104011', 'password' => 'Rahasia123'])
            ->assertSessionHasErrors('identity');

        $this->assertGuest();
    }

    public function test_admin_terakhir_tidak_bisa_dihapus(): void
    {
        $a = $this->makeUser('admin', ['identifier' => null, 'email' => 'a@contoh.ac.id']);
        $b = $this->makeUser('admin', ['identifier' => null, 'email' => 'b@contoh.ac.id']);

        $this->actingAs($a)->delete("/admin/pengguna/{$a->id}")->assertForbidden(); // akun sendiri

        $b->delete();
        $this->actingAs($a)->delete("/admin/pengguna/{$a->id}")->assertForbidden();
        $this->assertDatabaseHas('users', ['id' => $a->id]);
    }

    public function test_reset_sandi_mengeluarkan_sesi_dan_memaksa_ganti(): void
    {
        $admin = $this->makeUser('admin', ['identifier' => null, 'email' => 'a@contoh.ac.id']);
        $siswa = $this->makeUser('siswa');

        $this->actingAs($admin)->put("/admin/pengguna/{$siswa->id}/password")->assertRedirect();

        $this->assertTrue($siswa->fresh()->must_change_password);
        $this->assertFalse(Hash::check('Rahasia123', $siswa->fresh()->password));
    }
    public function test_siswa_tidak_bisa_membuat_akun(): void
    {
        $this->actingAs($this->makeUser())
            ->post('/admin/pengguna', [
                'name' => 'Penyusup',
                'role' => 'admin',
                'identifier' => '999',
                'password' => 'Rahasia123',
            ])
            ->assertForbidden();

        $this->assertDatabaseMissing('users', ['identifier' => '999']);
    }

    public function test_admin_membuat_akun_dengan_sandi_sementara(): void
    {
        $admin = $this->makeUser('admin', ['identifier' => null, 'email' => 'a@contoh.ac.id']);

        $this->actingAs($admin)
            ->post('/admin/pengguna', [
                'name' => 'Nadia Putri',
                'role' => 'siswa',
                'identifier' => '2026104099',
                'email' => '',
                'password' => '',
            ])
            ->assertSessionHasNoErrors()
            ->assertSessionHas('generated');

        $this->assertDatabaseHas('users', [
            'identifier' => '2026104099',
            'role' => 'siswa',
            'must_change_password' => true,
        ]);
    }

    public function test_peran_tidak_valid_ditolak(): void
    {
        $admin = $this->makeUser('admin', ['identifier' => null, 'email' => 'a@contoh.ac.id']);

        $this->actingAs($admin)
            ->post('/admin/pengguna', ['name' => 'X', 'role' => 'superadmin', 'identifier' => '1'])
            ->assertSessionHasErrors('role');
    }

    public function test_nama_berisi_html_disimpan_sebagai_teks_biasa(): void
    {
        $admin = $this->makeUser('admin', ['identifier' => null, 'email' => 'a@contoh.ac.id']);

        $this->actingAs($admin)->post('/admin/pengguna', [
            'name' => '<script>alert(1)</script>',
            'role' => 'siswa',
            'identifier' => '2026104100',
        ])->assertSessionHasNoErrors();

        $this->assertDatabaseHas('users', ['name' => '<script>alert(1)</script>']);
    }
}
