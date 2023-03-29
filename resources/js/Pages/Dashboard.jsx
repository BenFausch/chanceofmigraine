import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Checkbox from '@/Components/Checkbox';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


export default function Dashboard({ auth }) {
    console.log("USER IS", auth.user)

    const [current, setCurrent] = useState();

    function weatherDataControlPanel() {
        if (current?.aqi) {
            return Object.entries(current).map(([k, v]) => {
                let label = k.replace(/\_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                return <p className="w-16 mx-8 my-4 inline-block text-center" key={k}>{label}: {<CircularProgressbar value={v} text={`${v}`} styles={buildStyles({
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
            cloudcover: hourlyData.cloudcover[hourIndex] + weatherData.weather.hourly_units.cloudcover,
            pressure_msl: hourlyData.pressure_msl[hourIndex] + weatherData.weather.hourly_units.pressure_msl,
            precipitation_probability: hourlyData.precipitation_probability[hourIndex] + weatherData.weather.hourly_units.precipitation_probability,
            visibility: hourlyData.visibility[hourIndex] + weatherData.weather.hourly_units.visibility,
            relative_humidity_2m: hourlyData.relativehumidity_2m[hourIndex] + weatherData.weather.hourly_units.relativehumidity_2m,
            windspeed_10m: hourlyData.windspeed_10m[hourIndex] + weatherData.weather.hourly_units.windspeed_10m,
        }
    }

    useEffect(() => {
        if (!(current?.aqi)) {
            axios.get('/weather')
                .then(response => {
                    console.log('weather data:', response.data);
                    setCurrent(parseCurrentData(response.data))
                    setData({
                        'migraine':response.data.daily_data.migraine,
                        'water':response.data.daily_data.water,
                        'trigger_foods':response.data.daily_data.trigger_foods,
                        'food_list':response.data.daily_data.food_list
                    })
                });
        }

        

    }, [current])

    const { data, setData, patch, processing, errors, reset } = useForm({
        name: auth.user.name,
        email: auth.user.email,
        password: '',
        password_confirmation: '',
        migraine:false,
        water:false,
        trigger_foods:false,
        food_list:'',
        weather:''
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('weather.update'));
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
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2>Today's dashboard</h2>
                            <div className="">
                                {weatherDataControlPanel(current)}
                            </div>
                        </div>
                        <div className="p-6 text-gray-900">

                            <h2>Today's checklist</h2>
                            <form onSubmit={submit}>
                                <div className="block mt-4">
                                    <label className="flex items-center">
                                        <Checkbox
                                            name="migraine"
                                            checked={data.migraine}
                                            onChange={(e) => setData('migraine', e.target.checked)}
                                        />
                                        <span className="ml-2 text-sm text-gray-600">Did you have a migraine yesterday?</span>
                                    </label>
                                </div>
                                <div className="block mt-4">
                                    <label className="flex items-center">
                                        <Checkbox
                                            name="water"
                                            checked={data.water}
                                            onChange={(e) => setData('water', e.target.checked)}
                                        />
                                        <span className="ml-2 text-sm text-gray-600">Did you drink enough water yesterday?</span>
                                    </label>
                                </div>
                                <div className="block mt-4">
                                    <label className="flex items-center">
                                        <Checkbox
                                            name="trigger_foods"
                                            checked={data.trigger_foods}
                                            onChange={(e) => setData('trigger_foods', e.target.checked)}
                                        />
                                        <span className="ml-2 text-sm text-gray-600">Did you eat any trigger foods?</span>
                                    </label>
                                </div>
                                {data.trigger_foods?
                                 <div>
                                 <InputLabel htmlFor="foodlist" value="Which ones?" />

                                 <TextInput
                                     id="foodlist"
                                     name="food_list"
                                     value={data.food_list}
                                     className="mt-1 block w-full"
                                     autoComplete="name"
                                     isFocused={true}
                                     onChange={(e) => setData('food_list', e.target.value)}
                                 />

                                 <InputError message={errors.food_list} className="mt-2" />
                             </div>:''}


                                <div className="flex items-center justify-end mt-4">

                                    <PrimaryButton className="ml-4" disabled={processing}>
                                        Save it!
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
