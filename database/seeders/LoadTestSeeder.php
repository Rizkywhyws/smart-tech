<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class LoadTestSeeder extends Seeder
{
    public function run(): void
    {
        abort_if(app()->isProduction(), 1, 'Jangan jalankan di produksi.');

        $hash = Hash::make('Rahasia123');
        $roles = ['siswa', 'siswa', 'siswa', 'mahasiswa', 'mahasiswa', 'guru'];

        foreach (range(0, 49) as $chunk) {
            $rows = [];

            for ($i = 0; $i < 1000; $i++) {
                $n = $chunk * 1000 + $i;

                $rows[] = [
                    'name' => fake('id_ID')->name(),
                    'role' => $roles[$n % count($roles)],
                    'identifier' => 'T'.str_pad((string) $n, 8, '0', STR_PAD_LEFT),
                    'password' => $hash,
                    'must_change_password' => false,
                    'created_at' => now()->subMinutes($n),
                    'updated_at' => now(),
                ];
            }

            DB::table('users')->insert($rows);
        }
    }
}