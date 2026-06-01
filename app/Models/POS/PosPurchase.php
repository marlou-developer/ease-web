<?php

namespace App\Models\POS;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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

    public function supplier()
    {
        return $this->belongsTo(PosSupplier::class);
    }

    public function items()
    {
        return $this->hasMany(PosPurchaseItem::class, 'pos_purchase_id');
    }
}
