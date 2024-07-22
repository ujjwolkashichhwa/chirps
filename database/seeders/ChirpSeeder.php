<?php

namespace Database\Seeders;

use App\Models\Chirp;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ChirpSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $chirps = [
            ['message' => "This chirp is for test1", 'sort_order' => 1, 'user_id' => 1],
            ['message' => "This chirp is for test2", 'sort_order' => 2, 'user_id' => 1],
            ['message' => "This chirp is for test3", 'sort_order' => 3, 'user_id' => 1],
            ['message' => "This chirp is for test4", 'sort_order' => 4, 'user_id' => 1],
        ];

        foreach ($chirps as $chirp) {
            Chirp::create($chirp);
        }
    }
}