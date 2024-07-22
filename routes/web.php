<?php

use App\Http\Controllers\ChirpController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::resource('chirps', ChirpController::class)
    ->only(['index', 'store', 'update', 'destroy'])
    ->middleware(['auth', 'verified']);

Route::post('/chirps/update-sort-order', [ChirpController::class, 'updateSortOrder'])
    ->middleware(['auth', 'verified'])
    ->name('chirps.updateSortOrder');

Route::resource('students', StudentController::class)
    ->only(['index', 'store', 'update', 'destroy'])
    ->middleware(['auth', 'verified']);

Route::get('/student/edit/{student}', [StudentController::class, 'edit'])
    ->middleware(['auth', 'verified'])
    ->name('student.edit');

Route::post('/students/update-sort-order', [StudentController::class, 'updateSortOrder'])
    ->middleware(['auth', 'verified'])
    ->name('students.updateSortOrder');

Route::resource('subjects', SubjectController::class)
    ->only(['index', 'store', 'update', 'destroy'])
    ->middleware(['auth', 'verified']);

Route::get('/subject/edit/{subject}', [SubjectController::class, 'edit'])
    ->middleware(['auth', 'verified'])
    ->name('subject.edit');

Route::post('/subjects/update-sort-order', [SubjectController::class, 'updateSortOrder'])
    ->middleware(['auth', 'verified'])
    ->name('subjects.updateSortOrder');

require __DIR__.'/auth.php';