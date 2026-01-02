<?php

namespace App\Models\POS;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PosUnit extends Model
{
    use HasFactory;
    protected $table = 'pos_units';
    protected $fillable = ['name'];

    public function products()
    {
        return $this->hasMany(PosProduct::class);
    }
}
