<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        $recaptchaSiteKey = config('app.recapta_site_key');
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
            'recaptchaSiteKey' => $recaptchaSiteKey,
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $recaptchaData = $this->validateRecaptcha($request);

        if (!$recaptchaData['success']) {
            return back()->withErrors(['recaptcha' => 'reCAPTCHA verification failed.']);
        } else {
            $request->authenticate();
    
            $request->session()->regenerate();
    
            return redirect()->intended(route('dashboard', absolute: false));
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }

    private function validateRecaptcha($request) {
        $recaptchaResponse = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
            'secret' => config('app.recapta_secret_key'),
            'response' => $request->recaptcha,
        ]);

        $recaptchaData = $recaptchaResponse->json();

        return $recaptchaData;
    }
}
