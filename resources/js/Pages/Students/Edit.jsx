import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import { useForm, Head, usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';

export default function Edit({ auth, subjects, student }) {
    const { data, setData, post, put, processing, reset, errors } = useForm({
        studentName: student.name || '',
        subjectId: student.subjects.map(subject => subject.id) || [],
    });

    const { flash } = usePage().props;

    const handleSubmit = (e) => {
        e.preventDefault();

        put(route('students.update', student.id), {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Edit Student" />
            <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
                <div className="w-full sm:max-w-lg mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                    {flash && <div className="mb-4 text-green-600">{flash}</div>}
                    <form onSubmit={handleSubmit} className="mt-2">
                        <input
                            className="block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                            type="text"
                            value={data.studentName}
                            onChange={(e) => setData('studentName', e.target.value)}
                            placeholder="Student Name"
                        />
                        <InputError message={errors.studentName} className='mt-2' />

                        <select multiple value={data.subjectId}
                                onChange={(e) => setData('subjectId', [...e.target.selectedOptions].map(option => option.value))}  
                                className="mt-2 block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm">
                            {subjects.map(subject => (
                                <option key={subject.id} value={subject.id}>{subject.name}</option>
                            ))}
                        </select>
                        <InputError message={errors.subjectId} className='mt-2' />

                        <PrimaryButton type="submit" className='mt-2 w-full text-center'>
                            Update Student
                        </PrimaryButton>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}