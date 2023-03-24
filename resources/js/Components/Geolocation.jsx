import { useEffect, useState } from 'react';

export default function Geolocation({ setUserLocation }) {

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.permissions
                .query({ name: "geolocation" })
                .then(function (result) {
                    if (result.state === "granted") {
                        console.log(result.state, result);
                        navigator.geolocation.getCurrentPosition(function (position) {
                            console.log("Latitude is :", position.coords.latitude);
                            console.log("Longitude is :", position.coords.longitude);
                           setUserLocation([position.coords.latitude, position.coords.longitude])
                        });
                    } else if (result.state === "prompt") {
                        console.log(result.state);
                    } else if (result.state === "denied") {
                      
                    }
                    result.onchange = function () {
                        console.log(result.state);
                        if (result.state === "granted") {
                            console.log('USER GRANTED',result.state);
                            setUserLocation([position.coords.latitude, position.coords.longitude])
                        }
                    };
                });
        } else {
            alert("Sorry Not available!");
        }  
        }, []);

    return (
        <div>
            <h2>GeoLocation</h2>
        </div>
    );
}
