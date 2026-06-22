<?php

namespace App\Models\POS;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PosStoreRequest extends Model
{
    protected $fillable = [
        'subscriber_id',
        'processor_id',
        'requestor_id',
        'receiver_id',
        'pos_store_id',
        'status',
    ];

    public function pos_store(): HasOne
    {
        return $this->hasOne(PosStore::class, 'id', 'pos_store_id')->with(['pos_warehouse']);
    }

    public function subscriber(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'subscriber_id');
    }
    public function processor(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'processor_id');
    }
    public function requestor(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'requestor_id');
    }
    public function receiver(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'receiver_id');
    }
}
