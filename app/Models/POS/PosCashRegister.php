<?php

namespace App\Models\POS;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PosCashRegister extends Model
{
    use HasFactory;

    protected $fillable = [
        'subscriber_id',
        'opening_amount',
        'closing_amount',
        'total_sales',
        'opened_at',
        'closed_at',
        'notes'
    ];

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function transactions()
    {
        return $this->hasMany(PosCashTransaction::class);
    }
}
