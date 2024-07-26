<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use App\Models\Student;
use App\Http\Requests\SubjectRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $recaptchaSiteKey = config('app.recapta_site_key');

        return Inertia::render('Subjects/Index', [
            'subjects' => Subject::with('students:id,id,name,sort_order')->get(),
            'flash' => session('success'),
            'recaptchaSiteKey' => $recaptchaSiteKey
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SubjectRequest $request)
    {
        $validated = $request->validated();

        Subject::create([
            'name' => $validated['subjectName']
        ]);

        return redirect()->route('subjects.index')->with('success', 'Subject Created Successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Subject $subject)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Subject $subject)
    {
        $recaptchaSiteKey = config('app.recapta_site_key');

        return Inertia::render('Subjects/Edit', [
            'subject' =>  $subject->load('students:id,id,name'), 
            'students' => Student::all(['id', 'name']),
            'recaptchaSiteKey' => $recaptchaSiteKey
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SubjectRequest $request, Subject $subject)
    {
        $validated = $request->validated();

        $subject->update([
            'name' => $validated['subjectName'],
        ]);

        $subject->students()->sync($validated['studentId']);

        return redirect()->route('subjects.index')->with('success', 'Subject updated Successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Subject $subject)
    {
        $subject->delete();

        return redirect()->route('subjects.index')->with('success', 'Subject deleted successfully');
    }
    /**
     * update the sort_order according to the dragged position
     */
    public function updateSortOrder(Request $request)
    {
        $sortedSubjects = $request->input('subjects');

        foreach ($sortedSubjects as $subjectData) {
            $subject = Subject::find($subjectData['id']);
            if ($subject) {
                $subject->sort_order = $subjectData['sort_order'];
                $subject->save();
            }
        }

        return redirect()->route('subjects.index');
    }
}