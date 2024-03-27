import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from "../assets/bg3.jpg";
import axios from "axios";

const Home = () => {
    // Sample data
    const [data, setData] = useState([]);
    const [Temperature, setTemperature] = useState();
    const [Humidity, setHumidity] = useState();
    const [Pressure, setPressure] = useState();
    const [Altitude, setAltitude] = useState();
    const [Relay1, setRelay1] = useState();
    const [Relay2, setRelay2] = useState();
    const [Relay3, setRelay3] = useState();
    const [Relay4, setRelay4] = useState();
    const [Predected, setPredected] = useState({ state: 0, reasons: [] });
    const navigate = useNavigate();

    const calculateState = async () => {
        console.log(Pressure, Temperature, Humidity, Altitude);
        // Define thresholds
        const temperatureThreshold = { min: 10, max: 50 }; // Example temperature range
        const humidityThreshold = { min: 30, max: 90 }; // Example humidity range
        const pressureThreshold = { min: 101000, max: 1200 }; // Example pressure range
        const altitudeThreshold = { min: 0, max: 101200 }; // Example altitude range

        // Initialize an array to store the reasons for the bad state
        const badStateReasons = [];

        // Check temperature
        if (Temperature < temperatureThreshold.min || Temperature > temperatureThreshold.max) {
            badStateReasons.push("Temperature is out of range");
            console.log(Temperature)
        }

        // Check humidity
        if (Humidity < humidityThreshold.min || Humidity > humidityThreshold.max) {
            badStateReasons.push("Humidity is out of range");
        }

        // Check pressure
        if (Pressure < pressureThreshold.min || Pressure > pressureThreshold.max) {
            badStateReasons.push("Pressure is out of range");
            console.log(Pressure);
        }

        // Check altitude
        if (Altitude < altitudeThreshold.min || Altitude > altitudeThreshold.max) {
            badStateReasons.push("Altitude is out of range");
        }

        // Set the predicted state based on whether badStateReasons array is empty or not
        if (badStateReasons.length > 0) {
            // If any parameter is outside the range, set state to 1 (bad) and display reasons
            setPredected({ state: 1, reasons: badStateReasons });
        } else {
            console.log("here")
            // Otherwise, set state to 0 (good)
            setPredected({ state: 0, reasons: [] });
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`https://odd-ruby-clownfish-belt.cyclic.app/api/patient`);
            console.log(response);
            setData(response.data);
            setTemperature(response.data[0].Temperature);
            setHumidity(response.data[0].Humidity);
            setPressure(response.data[0].Pressure);
            setAltitude(response.data[0].Altitude);
            setRelay1(response.data[0].Relay1);
            setRelay2(response.data[0].Relay2);
            setRelay3(response.data[0].Relay3);
            setRelay4(response.data[0].Relay4);
            console.log(Predected);



        };
        fetchData();
    }, []);

    useEffect(() => {
        calculateState();
    }, [Temperature, Humidity, Pressure, Altitude]);


    const toggleRelay = async (relayNumber) => {
        const newValue = !eval(`Relay${relayNumber}`);
        try {
            const response = await axios.put(`https://odd-ruby-clownfish-belt.cyclic.app/api/patient/${data[0]._id}`, {
                [`Relay${relayNumber}`]: newValue
            });
            if (response.status === 200) {
                // Update the state based on the response
                eval(`setRelay${relayNumber}(newValue)`);
            }
        } catch (error) {
            console.error("Error toggling relay:", error);
        }
    };


    const logouthandle = () => {
        localStorage.clear();
        navigate("/")
        window.location.reload();
    }

    return (
        <div style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div className="overflow-x-auto rounded-lg border border-gray-200 flex-grow">
                <div className="flex justify-between items-center mb-4 tex">
                    <h1 className="text-3xl font-bold  text-black align-centre">Industrial IOT Dashboard</h1>
                    <button onClick={logouthandle} className="px-4 py-2 bg-red-500 text-white rounded-md">Logout</button>
                </div>

                <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">


                    <div className="mt-8 sm:mt-12">
                        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div className="flex flex-col rounded-lg border border-gray-100 px-4 py-8 text-center">
                                <dt className="order-last text-3xl font-medium  text-black-500">Temperature</dt>

                                <dd className="text-4xl font-extrabold text-black-600 md:text-5xl">{Temperature}</dd>
                            </div>

                            <div className="flex flex-col rounded-lg border border-gray-100 px-4 py-8 text-center">
                                <dt className="order-last text-3xl font-medium text-black-500">Humidity</dt>

                                <dd className="text-4xl font-extrabold text-black-600 md:text-5xl">{Humidity}</dd>
                            </div>

                            <div className="flex flex-col rounded-lg border border-gray-100 px-4 py-8 text-center">
                                <dt className="order-last text-3xl font-medium text-black-500">Pressure</dt>

                                <dd className="text-4xl font-extrabold text-black-600 md:text-5xl">{Pressure}</dd>
                            </div>
                        </dl>
                        <br />
                        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div className="flex flex-col rounded-lg border border-gray-100 px-4 py-8 text-center">
                                <dt className="order-last text-3xl font-medium text-black-500">Altitude</dt>

                                <dd className="text-4xl font-extrabold text-black-600 md:text-5xl">{Altitude}</dd>
                            </div>

                            <div className="flex flex-col rounded-lg border border-gray-100 px-4 py-8 text-center">
                                <dt className="order-last text-3xl font-medium text-black-500">Relay 1</dt>
                                <dd className="text-4xl font-extrabold text-black-600 md:text-5xl">{Relay1}</dd>
                                <button onClick={() => toggleRelay(1)} className={`px-4 py-2 rounded-md ${Relay1 ? 'bg-green-500' : 'bg-red-500'}`}>
                                    {Relay1 ? 'On' : 'Off'}
                                </button>
                            </div>

                            <div className="flex flex-col rounded-lg border border-gray-100 px-4 py-8 text-center">
                                <dt className="order-last text-3xl font-medium text-black-500">Relay 2</dt>
                                <dd className="text-4xl font-extrabold text-black-600 md:text-5xl">{Relay2}</dd>
                                <button onClick={() => toggleRelay(2)} className={`px-4 py-2 rounded-md ${Relay2 ? 'bg-green-500' : 'bg-red-500'}`}>
                                    {Relay2 ? 'On' : 'Off'}
                                </button>
                            </div>
                        </dl>
                        <br />
                        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div className="flex flex-col rounded-lg border border-gray-100 px-4 py-8 text-center">
                                <dt className="order-last text-3xl font-medium text-black-500">Relay 3</dt>
                                <dd className="text-4xl font-extrabold text-black-600 md:text-5xl">{Relay3}</dd>
                                <button onClick={() => toggleRelay(3)} className={`px-4 py-2 rounded-md ${Relay3 ? 'bg-green-500' : 'bg-red-500'}`}>
                                    {Relay3 ? 'On' : 'Off'}
                                </button>
                            </div>
                            <div className="flex flex-col rounded-lg border border-gray-100 px-4 py-8 text-center">
                                <dt className="order-last text-3xl font-medium text-black-500">Relay 4</dt>
                                <dd className="text-4xl font-extrabold text-black-600 md:text-5xl">{Relay4}</dd>
                                <button onClick={() => toggleRelay(4)} className={`px-4 py-2 rounded-md ${Relay4 ? 'bg-green-500' : 'bg-red-500'}`}>
                                    {Relay4 ? 'On' : 'Off'}
                                </button>
                            </div>
                            <div className="flex flex-col rounded-lg border border-gray-100 px-4 py-8 text-center">
                                <dt className="order-last text-3xl font-medium text-black-500">Predicted</dt>
                                <dd className={`text-4xl font-extrabold md:text-5xl ${Predected.state === 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {Predected.state === 0 ? 'Good' : 'Bad'}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;