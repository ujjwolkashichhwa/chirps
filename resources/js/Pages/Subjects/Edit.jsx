import React, {useEffect, useState} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import { useForm, Head, usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import PrimaryButton from '@/Components/PrimaryButton';
import SelectField from '@/Components/SelectField';
import Recaptcha from '@/Components/Recaptcha';

export default function Edit({auth, subject, students, recaptchaSiteKey }) {
    const { data, setData, put, processing, reset, errors } = useForm({
       subjectName: subject ? subject.name : '',
       studentId: subject.students.map(student => student.id) || [],
    });

    const { flash } = usePage().props;
    const [shouldSubmit, setShouldSubmit] = useState(false);

    useEffect(() => {
        if(shouldSubmit && data.recaptcha) {
            put(route('subjects.update', { subject: subject.id }), {
                onSuccess: () => reset(),
            });

            setShouldSubmit(false);
        }
    }, [shouldSubmit, data.recaptcha]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Add Subjects" />
            <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
                <div className="w-full sm:max-w-lg mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                    {flash && <div className="mb-4 text-green-600">{flash}</div>}
                    <Recaptcha
                        recaptchaSiteKey={recaptchaSiteKey}
                        route='subjects'
                        setShouldSubmit={setShouldSubmit}
                        className="mt-2"
                        onSubmit={(token) => {
                            setData('recaptcha', token)
                        }}
                     >
                        <input
                            className="block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                            type="text"
                            value={data.subjectName}
                            onChange={(e) => setData('subjectName', e.target.value)}
                            placeholder="Subject Name"
                        />
                        <InputError message={errors.subjectName} className='mt-2' />

                        <SelectField
                            multiple={true}
                            value={data.studentId}
                            onChange={(e) => setData('studentId', [...e.target.selectedOptions].map(option => option.value))}  
                            items={students}
                        />

                        <PrimaryButton type="submit" className='mt-2 w-full text-center'>
                            Update Subject
                        </PrimaryButton>
                    </Recaptcha>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}