<?php

namespace App\Models\POS;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PosWarehouseStock extends Model
{
    use HasFactory;
    protected $fillable = [
        'pos_warehouse_id',
        'pos_supplier_id',
        'pos_product_id',
        'subscriber_id',
        'cost_price',
        'selling_price',
        'stocks',
    ];


    public function product(): HasOne
    {
        return $this->hasOne(PosProduct::class, 'id', 'pos_product_id');
    }
    public function pos_warehouse(): HasOne
    {
        return $this->hasOne(PosWarehouse::class, 'id', 'pos_warehouse_id');
    }
}
