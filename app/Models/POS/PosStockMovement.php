<?php

namespace App\Models\POS;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PosStockMovement extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_stock_id',
        'user_id',
        'type',
        'reference',
        'qty_before',
        'qty_change',
        'qty_after',
    ];

    public function product_stock(): HasOne
    {
        return $this->hasOne(PosProductStock::class, 'id', 'product_stock_id')->with('product');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
