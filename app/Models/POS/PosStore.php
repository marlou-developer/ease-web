<?php

namespace App\Models\POS;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PosStore extends Model
{
    use HasFactory;
    protected $fillable = [
        'subscriber_id',
        'name',
        'location',
    ];
}
