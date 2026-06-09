<?php

namespace App\Models\POS;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PosProductStock extends Model
{
    use HasFactory;

    protected $fillable = [
        'pos_store_id',
        'pos_product_id',
        'subscriber_id',
        'stocks',
        'cost_price',
        'selling_price',
        'discount',
        'discounted_price'
    ];


    public function product(): HasOne
    {
        return $this->hasOne(PosProduct::class, 'id', 'pos_product_id')->with('category','unit');
    }
}
