import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head } from '@inertiajs/react';
import DraggableSort from '@/Components/DraggableSort';

export default function Edit({ auth, mustVerifyEmail, status, recaptchaSiteKey  }) {
    const items = [
        { id: '1', component: <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} className="max-w-xl" recaptchaSiteKey={recaptchaSiteKey} /> },
        { id: '2', component: <UpdatePasswordForm className="max-w-xl" recaptchaSiteKey={recaptchaSiteKey} /> },
        { id: '3', component: <DeleteUserForm className="max-w-xl" recaptchaSiteKey={recaptchaSiteKey} /> }
    ]

    const renderItem = (item) => (
        <div key={item.id} className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
            {item.component}
        </div>
    );
    
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Profile</h2>}
        >
            <Head title="Profile" />

            <div className="py-12">
                {/* <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {items.map(({ id, component }) => (
                        <div key={id} className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                            {component}
                        </div>
                    ))}
                </div> */}
                <DraggableSort 
                    items={items}   
                    renderItem={renderItem}
                    container="div"
                    className= "max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6"
                />
            </div>
        </AuthenticatedLayout>
    );
}