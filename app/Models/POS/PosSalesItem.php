<?php

namespace App\Models\POS;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PosSalesItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'sale_id',
        'pos_store_id',
        'pos_product_stock_id',
        'quantity',
        'selling_price',
        'discount',
        'subtotal'
    ];

    public function sale()
    {
        return $this->belongsTo(PosSale::class, 'sale_id');
    }

    public function product()
    {
        return $this->belongsTo(PosProduct::class);
    }
}
