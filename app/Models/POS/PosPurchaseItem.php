<?php

namespace App\Models\POS;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PosPurchaseItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'pos_purchase_id',
        'pos_product_stock_id',
        'quantity',
        'cost_price',
        'subtotal'
    ];

    public function purchase()
    {
        return $this->belongsTo(PosPurchase::class, 'pos_purchase_id');
    }

    public function product_stock(): HasOne
    {
        return $this->hasOne(PosProductStock::class, 'id', 'pos_product_stock_id')->with(['product']);
    }
}
