<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class Chirp extends Model
{
    use HasFactory;

    protected $fillable = [
        'message',
        'sort_order'
    ];

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }

    public static function boot() {
        parent::boot();

        static::creating(function ($chirp) {
            $maxSortId = DB::table('chirps')->max('sort_order');

            $chirp->sort_order = $maxSortId ? $maxSortId +1 :1;
        });

        static::deleted(function ($chirp) {
            $chirps = Chirp::orderBy('sort_order')->get();
            $sortOrder = 1;
            foreach($chirps as $chirp) {
                $chirp->sort_order = $sortOrder++;
                $chirp->saveQuietly();
            }
        });
    }
}
