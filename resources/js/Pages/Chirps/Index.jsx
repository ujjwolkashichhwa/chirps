import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Chirp from '@/Components/Chirp';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm, Head } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import DraggableSort from '@/Components/DraggableSort';
 
export default function Index({ auth, chirps }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        message: '',
    });
 
    const submit = (e) => {
        e.preventDefault();

        post(route('chirps.store'), { onSuccess: () => reset() });
    };

    const handleUpdateSortOrder = (sortedChirps) => {
        Inertia.post(route('chirps.updateSortOrder'), { chirps: sortedChirps });
    }

    const renderItem = (chirp) =>( 
        <Chirp key={chirp.id} chirp={chirp} />
    );

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Chirps" />
 
            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                <form onSubmit={submit}>
                    <textarea
                        value={data.message}
                        placeholder="What's on your mind?"
                        className="block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                        onChange={e => setData('message', e.target.value)}
                    ></textarea>
                    <InputError message={errors.message} className="mt-2" />
                    <PrimaryButton className="mt-4" disabled={processing}>Chirp</PrimaryButton>
                </form>

                <DraggableSort 
                    items={chirps}
                    renderItem={renderItem}
                    type="container"
                    onSortEnd={(newSortedItems) =>{
                        handleUpdateSortOrder(newSortedItems);
                    }}
                />
            </div>
        </AuthenticatedLayout>
    );
}