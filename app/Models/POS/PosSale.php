<?php

namespace App\Models\POS;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PosSale extends Model
{
    use HasFactory;

    protected $fillable = [
        'pos_store_id',
        'subscriber_id',
        'cashier_id',
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

    public function customer(): HasOne
    {
        return $this->hasOne(PosCustomer::class, 'id', 'customer_id');
    }

    public function sale_items(): HasMany
    {
        return $this->hasMany(PosSalesItem::class, 'sale_id', 'id');
    }

    public function cashier(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'cashier_id');
    }

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }
}
