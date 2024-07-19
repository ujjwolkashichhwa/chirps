<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Student extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'sort_order'];

    public function subjects() {
        return $this->belongsToMany(Subject::class);
    }

    public static function boot() 
    {
        parent::boot();

        static::creating(function ($student) {
            $maxId =  DB::table('students')->max('id');
            $maxSortOrder =  DB::table('students')->max('sort_order');
            $student->id = $maxId ? $maxId + 1 : 1;
            $student->sort_order = $maxId ? $maxSortOrder + 1 : 1;
        });

        static::deleted(function ($student) {
            $students = Student::orderBy('sort_order')->get();
            $sortOrder = 1;
            foreach($students as $student) {
                $student->sort_order = $sortOrder++;
                $student->saveQuietly();
            }
        });
    }

}
