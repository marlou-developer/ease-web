<?php

namespace App\Models\POS;

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
}
