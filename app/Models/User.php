<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Cache;

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';
    public static function makeId(?string $role): string
    {
        $prefix = match ($role) {
            'admin' => 'AD',
            'guru' => 'GR',
            'siswa' => 'SW',
            default => throw new \InvalidArgumentException('Role tidak valid.'),
        };

        do {
            $id = sprintf('%s%04d', $prefix, random_int(0, 9999));
        } while (static::where('id', $id)->exists());

        return $id;
    }

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'must_change_password' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::saved(function (User $user) {
            if ($user->wasRecentlyCreated || $user->wasChanged('role')) {
                Cache::forget('user.role-counts');
            }
        });

        static::deleted(function () {
            Cache::forget('user.role-counts');
        });
    }

    public static function roleCounts(): array
    {
        return Cache::remember('user.role-counts', 300, fn() => static::query()
            ->selectRaw('role, count(*) as total')
            ->groupBy('role')
            ->pluck('total', 'role')
            ->all());
    }
}