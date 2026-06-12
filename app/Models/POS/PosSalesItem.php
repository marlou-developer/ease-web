<?php

namespace App\Models\POS;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PosSalesItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'sale_id',
        'pos_store_id',
        'pos_supplier_id',
        'pos_category_id',
        'pos_product_stock_id',
        'quantity',
        'cost_price',
        'selling_price',
        'total',
        'discount',
        'discounted_price',
        'profit'
    ];

    public function sale():HasOne
    {
        return $this->hasOne(PosSale::class, 'id','sale_id');
    }

    public function product()
    {
        return $this->belongsTo(PosProduct::class);
    }
     public function pos_product_stock():hasOne
    {
        return $this->hasOne(PosProductStock::class, 'id','pos_product_stock_id')->with(['product']);
    }
}
