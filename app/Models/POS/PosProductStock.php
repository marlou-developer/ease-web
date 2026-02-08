<?php

namespace App\Models\POS;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PosProductStock extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'subscriber_id',
        'stocks',
        'cost_price',
        'sell_price',
        'discount',
    ];


    public function product()
    {
        return $this->belongsTo(PosProduct::class)->with('category');
    }
}
