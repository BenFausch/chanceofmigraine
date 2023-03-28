import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import axios from 'axios';
import { CircularProgressbar, buildStyles  } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


export default function Dashboard({ auth }) {
    console.log("USER IS", auth.user)

    const [current, setCurrent] = useState();

    function weatherDataControlPanel() {
        if (current?.aqi) {
            return Object.entries(current).map(([k, v]) => {
                let label = k.replace('_',' ').replace(/\b\w/g, l => l.toUpperCase());
                return <p className="w-16 mx-8 my-4 inline-block text-center" key={k}>{label}: {<CircularProgressbar value={v} text={`${v}`}  styles={buildStyles({
                    textSize: '14px',
                    pathColor: '#ff9000',
                    textColor: '#f88',
                    trailColor: '#d6d6d6',
                    backgroundColor: '#3e98c7',
                    })} />}
                </p>
            });
        }
    }

    function parseCurrentData(weatherData) {
        let hourlyData = weatherData.weather.hourly
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
            aqi: weatherData.aqi.data.aqi,
            current_temperature: weatherData.weather.current_weather.temperature,
            wind_speed: weatherData.weather.current_weather.windspeed,
            uv_index: weatherData.weather.daily.uv_index_max[0],
            apparent_temperature: hourlyData.apparent_temperature[hourIndex] + weatherData.weather.hourly_units.apparent_temperature,
            cloudcover: hourlyData.cloudcover[hourIndex]+weatherData.weather.hourly_units.cloudcover,
            pressure_msl: hourlyData.pressure_msl[hourIndex]+weatherData.weather.hourly_units.pressure_msl,
            precipitation_probability: hourlyData.precipitation_probability[hourIndex]+weatherData.weather.hourly_units.precipitation_probability,
            visibility: hourlyData.visibility[hourIndex]+weatherData.weather.hourly_units.visibility,
            relativehumidity_2m: hourlyData.relativehumidity_2m[hourIndex]+weatherData.weather.hourly_units.relativehumidity_2m,
            windspeed_10m: hourlyData.windspeed_10m[hourIndex]+weatherData.weather.hourly_units.windspeed_10m,
        }
    }

    useEffect(() => {
        if (!(current?.aqi)) {
            axios.get('/weather')
                .then(response => {
                    console.log('weather data:', response.data);
                    setCurrent(parseCurrentData(response.data))
                });
        }

    }, [current])

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
                            <div className="">
                            {weatherDataControlPanel(current)}
                            </div>
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
