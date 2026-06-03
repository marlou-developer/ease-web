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
        'pos_warehouse_stock_id',
        'quantity',
        'cost_price',
        'subtotal'
    ];

    public function purchase()
    {
        return $this->belongsTo(PosPurchase::class, 'pos_purchase_id');
    }

    public function pos_warehouse_stock(): HasOne
    {
        return $this->hasOne(PosWarehouseStock::class, 'id', 'pos_warehouse_stock_id')->with(['product']);
    }
}
