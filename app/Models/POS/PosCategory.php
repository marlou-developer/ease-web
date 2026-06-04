<?php

namespace App\Models\POS;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PosCategory extends Model
{
    use HasFactory;

    protected $fillable = ['subscriber_id','name', 'description'];

    public function products()
    {
        return $this->hasMany(PosProduct::class);
    }
}
