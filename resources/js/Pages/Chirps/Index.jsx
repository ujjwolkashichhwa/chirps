import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Chirp from '@/Components/Chirp';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm, Head } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import DraggableSort from '@/Components/DraggableSort';
import Recaptcha from '@/Components/Recaptcha';
 
export default function Index({ auth, chirps, recaptchaSiteKey }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        message: '',
        recaptcha: ''
    });
 
    const [shouldSubmit, setShouldSubmit] = useState(false);

    useEffect(() => {
        if(shouldSubmit && data.recaptcha) {
            post(route('chirps.store'), { onSuccess: () => reset() });

            setShouldSubmit(false);
        }
    }, [shouldSubmit, data.recaptcha]);

    const handleUpdateSortOrder = (sortedChirps) => {
        Inertia.post(route('chirps.updateSortOrder'), { chirps: sortedChirps });
    }

    const renderItem = (chirp) =>( 
        <Chirp key={chirp.id} chirp={chirp} recaptchaSiteKey={recaptchaSiteKey}/>
    );

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Chirps" />
 
            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                    <Recaptcha
                        recaptchaSiteKey={recaptchaSiteKey}
                        route='chirps'
                        setShouldSubmit={setShouldSubmit}
                        className="mt-2"
                        onSubmit={(token) => {
                            setData('recaptcha', token)
                        }}
                     >
                    <textarea
                        value={data.message}
                        placeholder="What's on your mind?"
                        className="block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                        onChange={e => setData('message', e.target.value)}
                    ></textarea>
                    <InputError message={errors.message} className="mt-2" />
                    <PrimaryButton className="mt-4" disabled={processing}>Chirp</PrimaryButton>
                </Recaptcha>

                <DraggableSort 
                    items={chirps}
                    renderItem={renderItem}
                    container="div"
                    className="mt-6 bg-white shadow-sm rounded-lg divide-y"
                    onSortEnd={(newSortedItems) =>{
                        handleUpdateSortOrder(newSortedItems);
                    }}
                />
            </div>
        </AuthenticatedLayout>
    );
}