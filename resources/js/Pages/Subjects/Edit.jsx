import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import { useForm, Head, usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Edit({auth, subject}) {
    const { data, setData, post, processing, reset, errors } = useForm({
       subjectName: subject ? subject.name : '',
    });

    const { flash } = usePage().props;

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('subjects.update'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Add Subjects" />
            <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
                <div className="w-full sm:max-w-lg mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                    {flash && <div className="mb-4 text-green-600">{flash}</div>}
                    <form onSubmit={handleSubmit} className="mt-2">
                        <input
                            className="block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                            type="text"
                            value={data.subjectName}
                            onChange={(e) => setData('subjectName', e.target.value)}
                            placeholder="Subject Name"
                        />
                        <InputError message={errors.subjectName} className='mt-2' />

                        <PrimaryButton type="submit" className='mt-2 w-full text-center'>
                            Update Subject
                        </PrimaryButton>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}