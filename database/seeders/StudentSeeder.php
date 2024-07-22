<?php

namespace Database\Seeders;

use App\Models\Student;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $students = [
            ['name' => 'John Doe', 'sort_order' => 1],
            ['name' => 'Jane Smith', 'sort_order' => 2],
            ['name' => 'Alice Johnson', 'sort_order' => 3],
            // Add more dummy students as needed
        ];

        foreach ($students as $student) {
            Student::create($student);
        }
    }
}
