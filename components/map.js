import React from "react"
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api"
import { useState } from "react"
//import Router from 'next/router'
const snarkjs = require("snarkjs")

const statsLat = [
    { name: "Min Longitude", stat: 100 },
    { name: "Max Longitude", stat: 150 }
]

const statsLong = [
    { name: "Total Subscribers", stat: "71,897" },
    { name: "Avg. Open Rate", stat: "58.16%" }
]

const statsCurrent = [
    { name: "Total Subscribers", stat: "71,897" },
    { name: "Avg. Open Rate", stat: "58.16%" }
]

const containerStyle = {
    width: "380px",
    height: "440px"
}

var center = {
    lat: 4.62,
    lng: -74.09
}

export default function Map() {
    const [isConnected, setIsConnected] = useState()

    const [minLat, setMinLat] = useState(0)
    const [maxLat, setMaxLat] = useState(0)
    const [minLong, setMinLong] = useState(0)
    const [maxLong, setMaxLong] = useState(0)
    const [currentLat, setCurrentLat] = useState(0)
    const [currentLong, setCurrentLong] = useState(0)
    const [mainProof, setMainProof] = useState()
    const [mainPublicSignals, setMainPublicSignals] = useState()
    const [isVerified, setIsVerified] = useState(false)

    const [activeMarker, setActiveMarker] = useState(null)
    const [locationSelected,setLocationSelected] = useState(false)

    const handleActiveMarker = (marker) => {
        if (marker === activeMarker) {
            return
        }
        setActiveMarker(marker)
    }


    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: "AIzaSyAIJx9hwjxcmt2-VjyW5MCxwPqlVvTW51w"
    })

    const [map, setMap] = React.useState(null)

    const onLoad = React.useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds(center)
        map.fitBounds(bounds)
        setMap(map)
    }, [])

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, [])

    async function getFileBuffer(filename) {
        let req = await fetch(filename)
        return Buffer.from(await req.arrayBuffer())
    }

    async function generateProof(state, setState) {
        // Load files and run proof locally
        getLocation();
        let DOMAIN = "http://localhost:3000"
        let VERCEL_DOMAIN = "https://daordinate-three.vercel.app/"
        let wasmBuff = await getFileBuffer(`${DOMAIN}/inRange.wasm`)
        let zkeyBuff = await getFileBuffer(`${DOMAIN}/inRange.zkey`)

        let input = {
            latitudeRange: [parseInt(minLat) + 1000, parseInt(maxLat) + 1000],
            longitudeRange: [
                parseInt(minLong) + 1000,
                parseInt(maxLong) + 1000
            ],
            currentLocation: [
                parseInt(currentLat) + 1000,
                parseInt(currentLong) + 1000
            ]
        }

        try {
            let { proof, publicSignals } = await snarkjs.plonk.fullProve(
                input,
                wasmBuff,
                zkeyBuff
            )

            setMainProof(proof)
            setMainPublicSignals(publicSignals)

            //   setState({...state, proof:proof, publicSignals:publicSignals})
        } catch (error) {
            alert("Location too far away: Invalid Proof")
        }
    }



    const [location, setLocation] = useState({
        lat: "",
        long: ""
    })

    function getLocation(){
      const onSuccess = (loc) => {
          setLocation({
              lat: loc.coords.latitude,
              long: loc.coords.longitude
          })
         
    

          const lat =loc.coords.latitude;
          const long = loc.coords.longitude;
          setCurrentLat(lat)
          setCurrentLong(long)
          console.log("Latitude")
          console.log(lat)
          console.log("Longitude")
          console.log(long)

      }

      const onError =()=>{
          console.log("Could not get Location")
      }

      navigator.geolocation.getCurrentPosition(onSuccess,onError)
  }

    function getLatTarget() {
        const onSuccess = (loc) => {
            setMinLat(loc - 10)
            setMaxLat(loc + 10)
            console.log("Target")
            console.log(minLat)
            console.log(maxLat)
            console.log(loc)
        }

        const onError = () => {
            console.log("Could not get Location")
        }
    }

    return (
        <div className="flex flex-col justify-evenly">
            {isLoaded ? (
                <div className="w-[400px]">
                    <GoogleMap
                        onLoad={onLoad}
                        onUnmount={onUnmount}
                        onClick={(ev) => {
                            setMinLat(ev.latLng.lat())
                            setMaxLat(ev.latLng.lat() + 100)
                            setMinLong(ev.latLng.lng())
                            setMaxLong(ev.latLng.lng() + 100)
                            ;() => setActiveMarker(null)
                            getLatTarget
                        }}
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={11}
                    ></GoogleMap>
                </div>
            ) : (
                <></>
            )}
            <div className="ml-2 mr-2 mb-4">
            {locationSelected ? <button
                    type="button"
                    className="w-full mt-5 items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={getLocation}
                >
                    Select a location
                </button> :                    
                 <button
                        type="button"
                        className="ml-1 mr-1 w-full text-center px-4 py-2 border border-transparent font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={generateProof}
                    >
                        Generate Proof
                    </button> }
                
                {/* <div className="mt-5 grid grid-cols-2 gap-1 sm:grid-cols-2">

                </div> */}
            </div>
        </div>
    )
}
