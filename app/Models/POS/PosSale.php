<?php

namespace App\Models\POS;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PosSale extends Model
{
    use HasFactory;

    protected $fillable = [
        'pos_store_id',
        'subscriber_id',
        'customer_id',
        'invoice_no',
        'total_amount',
        'discount',
        'tax',
        'amount_paid',
        'change_due',
        'payment_type',
        'is_credit',
        'status'
    ];

    public function customer()
    {
        return $this->belongsTo(PosCustomer::class);
    }

    public function sale_items()
    {
        return $this->hasMany(PosSalesItem::class);
    }

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }
}
