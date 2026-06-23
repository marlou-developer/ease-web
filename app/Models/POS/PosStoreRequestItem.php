<?php

namespace App\Models\POS;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PosStoreRequestItem extends Model
{

    protected $fillable = [
        'pos_store_request_id',
        'pos_warehouse_stock_id',
        'quantity',
    ];

    public function warehouse_stock(): HasOne
    {
        return $this->hasOne(PosWarehouseStock::class, 'id', 'pos_warehouse_stock_id')->with(['product']);
    }
}
