import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import { useForm, Head, usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import PrimaryButton from '@/Components/PrimaryButton';
import DraggableSort from '@/Components/DraggableSort';
import InputField from '@/Components/InputField';
import SelectField from '@/Components/SelectField';

export default function Index({auth, subjects, students}) {
    const { data, setData, post, processing, reset, errors } = useForm({
        studentName: '',
        subjectId: [],
    });

    const { flash } = usePage().props;

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('students.store'), {
            onSuccess: () => reset(),
        });
    };

    const handleEdit = (student) => {
        Inertia.get(route('student.edit', student));
    };

    const handleDelete = (id) => {
        Inertia.delete(route('students.destroy', id));
    }

    const handleUpdateSortOrder = (sortedStudents)=> {
        Inertia.post(route('students.updateSortOrder'), { students: sortedStudents });
    }

    const renderStudentRow = (student) =>(
        <>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.sort_order}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"> 
                <ul>
                    {student.subjects
                    .sort((a, b) => a.sort_order - b.sort_order)
                    .map((subject, index) => (
                        <li key={index}>{subject.name}</li>
                    ))}
                </ul>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button 
                    onClick={() => handleEdit(student)} 
                    className="text-blue-600 hover:text-blue-900 mr-2"
                >
                    Edit
                </button>

                <button 
                    onClick={() => handleDelete(student.id)} 
                    className="text-red-600 hover:text-red-900"
                >
                    Delete
                </button>
            </td>
        </>
    );

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Add Students" />
            <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
                <div className="w-full sm:max-w-lg mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                    {flash && <div className="mb-4 text-green-600">{flash}</div>}
                    <form onSubmit={handleSubmit} className="mt-2">
                        <InputField
                            type="text"
                            value={data.studentName}
                            onChange={(e) => setData('studentName', e.target.value)}
                            placeholder="Student Name"
                        />
                        <InputError message={errors.studentName} className='mt-2' />

                        <SelectField
                            multiple={true}
                            value={data.subjectId}
                            onChange={(e) => setData('subjectId', [...e.target.selectedOptions].map(option => option.value))}  
                            items={subjects}
                        />
                        <InputError message={errors.subjectId} className='mt-2' />

                        <PrimaryButton type="submit" className='mt-2 w-full text-center'  disabled={data.subjectId.length === 0}>
                            Add Student
                        </PrimaryButton>
                    </form>
                    {
                        (students && students.length>0) && (
                            <table className="min-w-full divide-y divide-gray-200 mt-4">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Id</th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subjects</th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>   
                                <DraggableSort
                                    items={students}
                                    renderItem={renderStudentRow}
                                    type="table"
                                    onSortEnd={(newSortedItems)=> {
                                        handleUpdateSortOrder(newSortedItems);
                                    }}
                                />
                            </table>
                        )
                    }
                </div>
            </div>
        </AuthenticatedLayout>
    );
}