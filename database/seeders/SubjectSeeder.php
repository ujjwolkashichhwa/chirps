<?php

namespace Database\Seeders;

use App\Models\Subject;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $subjects = [
            ['name' => 'Mathematics', 'sort_order' => 1],
            ['name' => 'Science', 'sort_order' => 2],
            ['name' => 'History', 'sort_order' => 3],
            // Add more dummy subjects as needed
        ];

        foreach ($subjects as $subject) {
            Subject::create($subject);
        }
    }
}
