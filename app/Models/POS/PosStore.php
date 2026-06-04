<?php

namespace App\Models\POS;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PosStore extends Model
{
    use HasFactory;
    protected $fillable = [
        'subscriber_id',
        'pos_warehouse_id',
        'name',
        'location',
    ];

    public function pos_warehouse(): HasOne
    {
        return $this->hasOne(PosWarehouse::class, 'id', 'pos_warehouse_id')->with(['pos_warehouse_stocks']);
    }
}
