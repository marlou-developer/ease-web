<?php

namespace App\Models\POS;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PosWarehouse extends Model
{
    use HasFactory;
    protected $fillable = [
        'subscriber_id',
        'name',
        'location',
    ];
}
