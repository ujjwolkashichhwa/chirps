import React, {useRef} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import { useForm, Head, usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import PrimaryButton from '@/Components/PrimaryButton';
import DraggableSort from '@/Components/DraggableSort';
import InputField from '@/Components/InputField';

export default function Index({ auth, subjects }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        subjectName: '',
    });
    const tableRef = useRef(null);

    const { flash } = usePage().props;

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('subjects.store'), {
            onSuccess: () => reset(),
        });
    };

    const handleEdit = (subject) => {
        Inertia.get(route('subject.edit', subject));
    };

    const handleDelete = (id) => {
        Inertia.delete(route('subjects.destroy', id));
    };

    const handleUpdateSortOrder = (sortedSubjects)=> {
        Inertia.post(route('subjects.updateSortOrder'), { subjects: sortedSubjects });
    }

    const renderSubjectRow = (subject) => (
        <>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{subject.sort_order}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{subject.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <ul>
                    {subject.students
                    .sort((a, b) => a.sort_order - b.sort_order)
                    .map((student, index) => (
                        <li key={index}>{student.name}</li>
                    ))}
                </ul>    
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button 
                    onClick={() => handleEdit(subject)} 
                    className="text-blue-600 hover:text-blue-900 mr-2"
                >
                    Edit
                </button>
                <button 
                    onClick={() => handleDelete(subject.id)} 
                    className="text-red-600 hover:text-red-900"
                >
                    Delete
                </button>
            </td>
        </>
    );

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Add Subjects" />
            <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
                <div className="w-full sm:max-w-lg mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                    {flash && <div className="mb-4 text-green-600">{flash}</div>}
                    <form onSubmit={handleSubmit} className="mt-2">
                        <InputField
                            type="text"
                            value={data.subjectName}
                            onChange={(e) => setData('subjectName', e.target.value)}
                            placeholder="Subject Name"
                        />
                        <InputError message={errors.subjectName} className='mt-2' />

                        <PrimaryButton type="submit" className='mt-2 w-full text-center'>
                            Add Subject
                        </PrimaryButton>
                    </form>
                    {
                        (subjects && subjects.length > 0) && (
                            <table className="min-w-full divide-y divide-gray-200 mt-4">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Id</th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subjects</th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <DraggableSort 
                                    items={subjects} 
                                    renderItem={renderSubjectRow} 
                                    type="table"
                                    onSortEnd={(newSortedSubjects) => {
                                        handleUpdateSortOrder(newSortedSubjects);
                                    }} 
                                    tableRef={tableRef}
                                />
                            </table>
                        )
                    }
                </div>
            </div>
        </AuthenticatedLayout>
    );
}