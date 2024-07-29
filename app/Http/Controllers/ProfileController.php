<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $recaptchaSiteKey = config('app.recapta_site_key');

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'recaptchaSiteKey' => $recaptchaSiteKey
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $recaptchaData = $this->validateRecaptcha($request);

        if (!$recaptchaData['success']) {
            return back()->withErrors(['recaptcha' => 'reCAPTCHA verification failed.']);
        } else {
            $request->user()->fill($request->validated());

            if ($request->user()->isDirty('email')) {
                $request->user()->email_verified_at = null;
            }

            $request->user()->save();

            return Redirect::route('profile.edit');
        }
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $recaptchaData = $this->validateRecaptcha($request);

        if (!$recaptchaData['success']) {
            return back()->withErrors(['recaptcha' => 'reCAPTCHA verification failed.']);
        } else {
            $request->validate([
                'password' => ['required', 'current_password'],
            ]);
    
            $user = $request->user();
    
            Auth::logout();
    
            $user->delete();
    
            $request->session()->invalidate();
            $request->session()->regenerateToken();
    
            return Redirect::to('/');
        }
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
