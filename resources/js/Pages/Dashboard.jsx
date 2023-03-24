import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Geolocation from '@/Components/Geolocation'





export default function Dashboard({ auth }) {
    console.log("USER IS", auth.user)

    // const [userPosition, setUserPosition] = useState([0, 0]);


    const { data, setData, patch, processing, errors, reset } = useForm({
        name: auth.user.name,
        email: auth.user.email,
        password: '',
        password_confirmation: '',
        // lat: userPosition[0],
        // long: userPosition[1]
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };
    

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">You're logged in!</div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white mt-8 shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1>
                                User data
                            </h1>
                            {/* //////// */}
                            {/* <Geolocation setUserLocation={(e) => setUserPosition(e)} /> */}
                            {/* <div>Your lat is:{userPosition[0]}</div>
                            <div>Your long is:{userPosition[1]}</div> */}
                            {/* <div>Your city is:</div> */}
                            <form onSubmit={submit}>
                                <div>
                                    <InputLabel htmlFor="name" value="Name" />

                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={auth.user.name}
                                        className="mt-1 block w-full"
                                        autoComplete="name"
                                        isFocused={true}
                                        onChange={(e) => setData('name', e.target.value)}
                                        // required
                                        disabled
                                    />

                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="email" value="Email" />

                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={auth.user.email}
                                        className="mt-1 block w-full"
                                        autoComplete="username"
                                        onChange={(e) => setData('email', e.target.value)}
                                        // required
                                        disabled
                                    />

                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end mt-4">

                                    <PrimaryButton className="ml-4" disabled={processing}>
                                        Update
                                    </PrimaryButton>
                                </div>
                            </form>
                            {/* /////// */}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
