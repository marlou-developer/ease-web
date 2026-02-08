<?php

namespace App\Models\POS;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PosProduct extends Model
{
    use HasFactory;

    protected $fillable = [
        'unit_id',
        'category_id',
        'barcode',
        'name',
        'image'
    ];


    public function category():HasOne
    {
        return $this->hasOne(PosCategory::class,'id','category_id');
    }

    public function unit()
    {
        return $this->belongsTo(PosUnit::class);
    }

    public function stocks()
    {
        return $this->hasMany(PosProductStock::class);
    }

    public function purchaseItems()
    {
        return $this->hasMany(PosPurchaseItem::class);
    }

    public function saleItems()
    {
        return $this->hasMany(PosSalesItem::class);
    }
}
