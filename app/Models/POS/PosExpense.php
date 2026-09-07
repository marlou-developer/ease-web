<?php

namespace App\Models\POS;

use Illuminate\Database\Eloquent\Model;

class PosExpense extends Model
{
    protected $fillable = [
        'subscriber_id',
        'pos_expense_category_id',
        'title',
        'amount',
        'description',
        'expense_date',
    ];

    public function category()
    {
        return $this->belongsTo(PosExpenseCategory::class, 'pos_expense_category_id');
    }
}
