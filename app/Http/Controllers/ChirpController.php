<?php

namespace App\Http\Controllers;

use App\Models\Chirp;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Http;    
use Inertia\Inertia;
use Inertia\Response;

class ChirpController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $recaptchaSiteKey = config('app.recapta_site_key');

        return Inertia::render('Chirps/Index', [
            'chirps' => Chirp::with('user:id,name')
                ->where('user_id', $user->id)
                ->latest()
                ->get(),
            'recaptchaSiteKey' => $recaptchaSiteKey
        ]);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $recaptchaData = $this->validateRecaptcha($request);

        if (!$recaptchaData['success']) {
            return back()->withErrors(['recaptcha' => 'reCAPTCHA verification failed.']);
        } else {
            $validated = $request->validate([
                'message' => 'required|string|max:255',
            ]);
    
            $request->user()->chirps()->create($validated);
     
            return redirect(route('chirps.index'));
        }
    }
    /**
     * Update the chirps in storage.
     */
    public function update(Request $request, Chirp $chirp): RedirectResponse
    {
        $recaptchaData = $this->validateRecaptcha($request);

        if (!$recaptchaData['success']) {
            return back()->withErrors(['recaptcha' => 'reCAPTCHA verification failed.']);
        } else {
            Gate::authorize('update', $chirp);
 
            $validated = $request->validate([
                'message' => 'required|string|max:255',
            ]);
    
            $chirp->update($validated);
    
            return redirect(route('chirps.index'));
        }
    }

    /**
     * Delete the chirps in storage.
     */
    public function destroy(Chirp $chirp): RedirectResponse
    {
        Gate::authorize('delete', $chirp);

        $chirp->delete();
    
        return redirect(route('chirps.index'));
    }

    /**
     * update the sort_order according to the dragged position
     */
    public function updateSortOrder(Request $request)
    {
        $sortedChirps = $request->input('chirps');

        foreach ($sortedChirps as $chirpData) {
            $chirp = Chirp::find($chirpData['id']);
            if ($chirp) {
                $chirp->sort_order = $chirpData['sort_order'];
                $chirp->save();
            }
        }

        return redirect()->route('chirps.index');
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
