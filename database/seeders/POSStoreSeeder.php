<?php

namespace Database\Seeders;

use App\Models\POS\PosStore;
use App\Models\POS\PosWarehouse;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class POSStoreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $stores = [
            ['name' => 'Egies Branch 1', 'location' => 'Downtown'],
            ['name' => 'Egies Branch 2', 'location' => 'Uptown'],
            ['name' => 'Egies Branch 3', 'location' => 'Airport'],
        ];

        foreach ($stores as $store) {
            PosStore::updateOrCreate(
                ['name' => $store['name']],
                [
                    'pos_warehouse_id' => 1,
                    'subscriber_id' => 2,
                    'location' => $store['location']
                ]
            );
        }
        PosWarehouse::create([
            'subscriber_id' => 2,
            'name' => 'SCC Warehouse',
            'location' => 'San Carlos City',
        ]);
    }
}
