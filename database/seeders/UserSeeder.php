<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'User', 
                'email' => 'user@test.com',
                'password' => Hash::make('Password@12') 
            ],
            [
                'name' => 'User1',
                'email' => 'user1@test.com',
                'password' => Hash::make('Password@12'),
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}