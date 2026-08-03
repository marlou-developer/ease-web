<?php

namespace App\Models\POS;

use Illuminate\Database\Eloquent\Model;

class PosCreditPayment extends Model
{
    protected $fillable = [
        'subscriber_id',
        'pos_sales_id',
        'payee_id',
        'customer_id',
        'amount',
        'payment_type'
    ];
}
