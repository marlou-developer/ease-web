<?php

namespace App\Models\POS;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PosPurchase extends Model
{
    use HasFactory;
    protected $fillable = [
        'subscriber_id',
        'pos_supplier_id',
        'reference_no',
        'total_amount',
        'status'
    ];

    public function supplier():HasOne
    {
        return $this->hasOne(PosSupplier::class,'id','pos_supplier_id');
    }

    public function items():HasMany
    {
        return $this->hasMany(PosPurchaseItem::class, 'pos_purchase_id','id')->with(['product_stock']);
    }
}
