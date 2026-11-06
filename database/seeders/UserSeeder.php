<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'username' => 'admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('admin'),
            'role' => 1,
        ]);

        User::create([
            'name' => 'Subscriber User',
            'username' => 'user',
            'email' => 'user@gmail.com',
            'subscriber_id' => 2,
            'password' => Hash::make('admin'),
            'role' => 2
        ]);
    }
}
