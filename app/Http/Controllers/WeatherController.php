<?php

namespace App\Http\Controllers;
use Illuminate\Http\Client\Response;//updated to use httpclient response object
use App\Models\weather;
use App\Models\Migrainelog;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class WeatherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Array    {
        $user = Auth::user();
        $lat = $user->lat;
        $long = $user->long;
        
        $exists = Migrainelog::whereDate('created_at', Carbon::today())->get()->toArray();

        if(empty($exists)){

        $weather_data= Http::get('https://api.open-meteo.com/v1/forecast?latitude='.$lat.'&longitude='.$long.'&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation_probability,pressure_msl,cloudcover,visibility,windspeed_10m,windspeed_80m,temperature_80m,uv_index&daily=uv_index_max&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=America%2FDenver');
       
        $aqi_data =  Http::get('http://api.waqi.info/feed/geo:'.$lat.';'.$long.'/?token=738fa2796b515eb5226987424090d10851e44d9e');
        
        Migrainelog::create([
            'user_id'=> $user->id,
            'aqi_data'=>json_encode($aqi_data->json()),
            'weather_data'=>json_encode($weather_data->json()),
        ]);

        return [
            'weather'=>$weather_data->json(),
            'aqi'=>$aqi_data->json()
        ];
    }else{
        return [
            'weather'=>json_decode($exists[0]['weather_data']),
            'aqi'=>json_decode($exists[0]['aqi_data'])
        ];
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(weather $weather)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(weather $weather)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, weather $weather)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(weather $weather)
    {
        //
    }
}
