<?php

namespace App\Models\POS;

use Illuminate\Database\Eloquent\Model;

class PosStoreRequestItem extends Model
{

    protected $fillable = [
        'pos_store_request_id',
        'pos_warehouse_stock_id',
        'quantity',
    ];
    
}
