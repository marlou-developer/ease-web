<?php

namespace App\Models\POS;

use Illuminate\Database\Eloquent\Model;

class PosExpenseCategory extends Model
{
    protected $fillable = [
        'subscriber_id',
        'name',
    ];

    public function expenses()
    {
        return $this->hasMany(PosExpense::class);
    }
}
