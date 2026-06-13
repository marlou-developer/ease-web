<?php

namespace App\Models\POS;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PosWarehouse extends Model
{
    use HasFactory;
    protected $fillable = [
        'subscriber_id',
        'name',
        'location',
    ];

    public function pos_warehouse_stocks(): HasMany
    {
        return $this->hasMany(PosWarehouseStock::class, 'pos_warehouse_id', 'id')->with(['product'])->orderBy('stocks', 'desc');
    }
}
