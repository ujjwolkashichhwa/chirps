<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'sort_order'];

    public function students() {
        return $this->belongsToMany(Student::class);
    }

    public static function boot()
    {
        parent::boot();

        static::creating(function ($subject) {
            $maxId = DB::table('subjects')->max('id');
            $maxSortOrder = DB::table('subjects')->max('sort_order');
            $subject->id = $maxId ? $maxId + 1 : 1;
            $subject->sort_order = $maxSortOrder ? $maxSortOrder + 1 : 1;
        });

        static::deleted(function ($subject) {
            $subjects = Subject::orderBy('sort_order')->get();
            $sortOrder = 1;
            foreach ($subjects as $subject) {
                $subject->sort_order = $sortOrder++;
                $subject->saveQuietly();
            }
        });
    }
}