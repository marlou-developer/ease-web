<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Models\POS\PosStore;
use App\Models\POS\PosUserLoginLog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'subscriber_id',
        'pos_store_id',
        'name',
        'email',
        'fname',
        'lname',
        'mname',
        'position',
        'pos_user_type',
        'security_pin',
        'password',
        'role',
        'is_locked',
        'locked_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_locked' => 'boolean',
            'locked_at' => 'datetime',
        ];
    }

    public function loginLogs(): HasMany
    {
        return $this->hasMany(PosUserLoginLog::class)->latest('login_at');
    }

     public function store():HasOne
    {
        return $this->hasOne(PosStore::class,'id','pos_store_id');
    }
}
