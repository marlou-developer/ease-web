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
        'pos_product_id',
        'subscriber_id',
        'stocks',
    ];


    public function product(): HasOne
    {
        return $this->hasOne(PosProduct::class, 'id', 'pos_product_id');
    }
}
