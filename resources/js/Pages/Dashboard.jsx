import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import axios from 'axios';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


export default function Dashboard({ auth }) {
    console.log("USER IS", auth.user)


    const [weatherData, setWeatherData] = useState();
    const [current, setCurrent] = useState();

    function parseCurrentData(hourlyData) {
        let now = new Date().toISOString();
        console.log("now", now.slice(0, now.length - 11))
        let hourIndex = hourlyData.time.indexOf(
            hourlyData.time.filter(
                (el) => el.includes(
                    now.slice(0, now.length - 11)
                )
            )
            [0]);

        console.log("hindex", hourIndex)
        return {
            apparent_temperature: hourlyData.apparent_temperature[hourIndex],
            cloudcover: hourlyData.cloudcover[hourIndex],
            pressure_msl: hourlyData.pressure_msl[hourIndex],
            precipitation_probability: hourlyData.precipitation_probability[hourIndex],
            visibility: hourlyData.visibility[hourIndex],
            relativehumidity_2m: hourlyData.relativehumidity_2m[hourIndex],
            windspeed_10m: hourlyData.windspeed_10m[hourIndex],

        }
    }

    useEffect(() => {
        if (!(weatherData?.weather)) {
            axios.get('/weather')
                .then(response => {
                    console.log('weather data:', response.data);
                    setWeatherData(response.data)
                    setCurrent(parseCurrentData(response.data.weather.hourly))
                });
        }

    }, [weatherData])

    const { data, setData, patch, processing, errors, reset } = useForm({
        name: auth.user.name,
        email: auth.user.email,
        password: '',
        password_confirmation: '',
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
                            <p className="w-20">AQI: {weatherData?.aqi.data.aqi ? <CircularProgressbar value={weatherData?.aqi.data.aqi} text={`${weatherData?.aqi.data.aqi}`} /> : ''}
                            </p>
                            
                            <p>Current Temp: {weatherData?.weather.current_weather.temperature}</p>
                            <p>Wind speed:{weatherData?.weather.current_weather.windspeed}</p>
                            <p>UV index: {weatherData?.weather.daily.uv_index_max[0]}</p>
                            <p>Apparent: {current?.apparent_temperature}</p>
                            <p>cloudcover {current?.cloudcover}</p>
                            <p>pressure_msl {current?.pressure_msl}</p>
                            <p>precipitation_probability {current?.precipitation_probability}</p>
                            <p>visibility {current?.visibility}</p>
                            <p>relativehumidity_2m {current?.relativehumidity_2m}</p>
                            <p>windspeed_10m {current?.windspeed_10m}</p>
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

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
