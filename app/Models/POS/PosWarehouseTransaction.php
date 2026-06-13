<?php

namespace App\Models\POS;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PosWarehouseTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'transact_by',
        'transaction_id',
        'subscriber_id',
        'pos_warehouse_id',
        'pos_product_stock_id',
        'pos_warehouse_stock_id',
        'pos_purchase_id',
        'stocks',
        'status',
    ];

    public function pos_purchase(): HasOne
    {
        return $this->hasOne(PosPurchase::class, 'id', 'pos_purchase_id');
    }
    public function pos_product_stock(): HasOne
    {
        return $this->hasOne(PosProductStock::class, 'id', 'pos_product_stock_id')->with(['pos_store', 'product']);
    }


    public function pos_warehouse(): HasOne
    {
        return $this->hasOne(PosWarehouse::class, 'id', 'pos_warehouse_id');
    }
    public function transact_by(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'transact_by');
    }
}
