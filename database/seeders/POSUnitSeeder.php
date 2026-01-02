<?php

namespace Database\Seeders;

use App\Models\POS\PosUnit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class POSUnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $units = [
            ['name' => 'Piece'],
            ['name' => 'Kilogram'],
            ['name' => 'Gram'],
            ['name' => 'Box'],
            ['name' => 'Litre'],
            ['name' => 'Pack'],
            ['name' => 'Meter'],
        ];

        foreach ($units as $unit) {
            PosUnit::updateOrCreate(
                ['name' => $unit['name']], // Unique identifier
                $unit
            );
        }
    }
}
