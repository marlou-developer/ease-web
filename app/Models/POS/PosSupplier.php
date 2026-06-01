<?php

namespace App\Models\POS;

use Illuminate\Database\Eloquent\Model;

class PosSupplier extends Model
{

    protected $fillable = [
        'subscriber_id',
        'name',
        'contact_person',
        'phone',
        'email',
        'address',
    ];
}
