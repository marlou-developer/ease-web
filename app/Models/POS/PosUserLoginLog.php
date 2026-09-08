<?php

namespace App\Models\POS;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PosUserLoginLog extends Model
{
    protected $fillable = [
        'user_id',
        'pos_store_id',
        'ip_address',
        'user_agent',
        'login_at',
        'logout_at',
    ];

    protected function casts(): array
    {
        return [
            'login_at' => 'datetime',
            'logout_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(PosStore::class, 'pos_store_id');
    }
}
