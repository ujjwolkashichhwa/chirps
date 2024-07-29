<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Subject;
use App\Http\Requests\StudentRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {   
        $recaptchaSiteKey = config('app.recapta_site_key');
        
        return Inertia::render('Students/Index', [
            'students' => Student::with('subjects:id,id,name,sort_order')->latest()->get(),
            'subjects' => Subject::all(['id', 'name']),
            'flash' => session('success'),
            'recaptchaSiteKey' => $recaptchaSiteKey
        ]);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(StudentRequest $request)
    {
        $recaptchaData = $this->validateRecaptcha($request);

        if (!$recaptchaData['success']) {
            return back()->withErrors(['recaptcha' => 'reCAPTCHA verification failed.']);
        } else {
            $validated = $request->validated();

            $student = Student::create([
                'name' => $validated['studentName'],
            ]);
    
            $student->subjects()->attach($validated['subjectId']);
    
            // Redirect or return a response
            return redirect()->route('students.index')->with('success', 'Student created successfully.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Student $student)
    {
        return $this->edit($student);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Student $student)
    {
        $recaptchaSiteKey = config('app.recapta_site_key');
        
        return Inertia::render('Students/Edit', [
            'student' => $student->load('subjects:id,id,name'), 
            'subjects' => Subject::all(['id', 'name']),
            'recaptchaSiteKey' => $recaptchaSiteKey
        ]);
    } 

    /**
     * Update the specified resource in storage.
     */
    public function update(StudentRequest $request, Student $student)
    {
        $recaptchaData = $this->validateRecaptcha($request);

        if (!$recaptchaData['success']) {
            return back()->withErrors(['recaptcha' => 'reCAPTCHA verification failed.']);
        } else {
            $validated = $request->validated();

            $student->update([
                'name' => $validated['studentName'],
            ]);

            $student->subjects()->sync($validated['subjectId']);

            return redirect()->route('students.index')->with('success', 'Student updated successfully.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Student $student)
    {
        $student->delete();
 
        return redirect()->route('students.index')->with('success', 'Student deleted successfully.');
    }
    /**
     * update the sort_order according to the dragged position
     */
    public function updateSortOrder(Request $request)
    {
        $sortedStudents = $request->input('students');

        foreach ($sortedStudents as $studentData) {
            $student = Student::find($studentData['id']);
            if ($student) {
                $student->sort_order = $studentData['sort_order'];
                $student->save();
            }
        }

        return redirect()->route('students.index');
    }

    /**
     * check the validation of recaptcha
     */
    private function validateRecaptcha($request) {
        $recaptchaResponse = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
            'secret' => config('app.recapta_secret_key'),
            'response' => $request->recaptcha,
        ]);

        $recaptchaData = $recaptchaResponse->json();

        return $recaptchaData;
    }
}