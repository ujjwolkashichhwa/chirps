import { useRef , useEffect, useState} from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import Recaptcha from '@/Components/Recaptcha';

export default function UpdatePasswordForm({ className = '', recaptchaSiteKey }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
        recaptcha: ''
    });

    const [shouldSubmit, setShouldSubmit] = useState(false);

    useEffect(() => {
        if(shouldSubmit && data.recaptcha) {
            put(route('password.update'), {
                preserveScroll: true,
                onSuccess: () => reset(),
                onError: (errors) => {
                    if (errors.password) {
                        reset('password', 'password_confirmation');
                        passwordInput.current.focus();
                    }
    
                    if (errors.current_password) {
                        reset('current_password');
                        currentPasswordInput.current.focus();
                    }
                },
            });

            setShouldSubmit(false);
        }
    }, [shouldSubmit, data.recaptcha]);

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Update Password</h2>

                <p className="mt-1 text-sm text-gray-600">
                    Ensure your account is using a long, random password to stay secure.
                </p>
            </header>
            <Recaptcha
                recaptchaSiteKey={recaptchaSiteKey}
                route='profile'
                setShouldSubmit={setShouldSubmit}
                className="mt-6 space-y-6"
                onSubmit={(token) => {
                    setData('recaptcha', token)
                }}
            >
                <div>
                    <InputLabel htmlFor="current_password" value="Current Password" />

                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        type="password"
                        className="mt-1 block w-full no-drag"
                        autoComplete="current-password"
                    />

                    <InputError message={errors.current_password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="New Password" />

                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="mt-1 block w-full no-drag"
                        autoComplete="new-password"
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />

                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        type="password"
                        className="mt-1 block w-full no-drag"
                        autoComplete="new-password"
                    />

                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing} className='no-drag'>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </div>
            </Recaptcha>
        </section>
    );
}
