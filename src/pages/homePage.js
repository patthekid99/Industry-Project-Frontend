import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import { FilterIcon } from '@heroicons/react/outline';
import { SearchIcon} from '@heroicons/react/solid';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Geocode from "react-geocode";


const APIKEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

Geocode.setApiKey(APIKEY);
Geocode.setRegion("ca");
Geocode.setLocationType("ROOFTOP");

export default function TestMap() {
    const [listings, setListings] = useState([])
    const [coordinates, setCord] = useState([{lat: 0, lng: 0}])

    useEffect(() => {
        async function getListings() {
            const results = await axios.get('https://localhost:44340/api/Test')
            const result = results.data
            for(let i = 0; i < result.length; i++) {
              Geocode.fromAddress(result[i].streetNum + " " + result[i].streetName + " " + result[i].city + " " + result[i].postalCode).then(
                (response) => {
                const { lat, lng } = response.results[0].geometry.location;
                result[i].lat = lat
                result[i].lng = lng
                setCord([...coordinates, {lat: lat, lng: lng}])
                }
              )
            }
            console.log(coordinates)
            setListings(result)
            console.log(result)
        }    
        getListings()
        console.log(listings)
        
    }, [])

    return(
        <>
        <div className="min-h-full py-10 bg-gray-100">
          <main>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 sm:rounded-[24px] bg-white">
              <div className="flex mb-4">
                <div className='w-full md:w-1/2 gap-4 flex flex-wrap' >
                  <form className="w-full flex pt-4 justify-center" action="#" method="GET">
                    <label htmlFor="search-field" className="sr-only">Search</label>
                      <div className="relative w-1/2 text-gray-400 focus-within:text-gray-600">
                        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none" aria-hidden="true">
                          <SearchIcon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <input
                          id="search-field"
                          name="search-field"
                          className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent sm:text-sm"
                          placeholder="Search Listings"
                          type="search"
                        />
                      </div>
                      <button
                        type="submit"
                        className="inline-flex justify-center px-3.5 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <FilterIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        <span className="sr-only">Search</span>
                      </button>
                    </form>
                    <div className='w-full min-h-screen gap-6 flex-wrap flex justify-center'>
                        {listings.map(i => (
                            <div className="w-64 p-2 bg-white rounded-xl transform transition-all shadow-lg">
                                <img className="h-40 object-cover rounded-xl" src={i.projectImage} alt="" />
                                <div className="p-2">
                                    <h2 className="font-bold text-lg mb-2 ">{i.developer.developerName}</h2>
                                    <p className="text-sm text-gray-600">It gives you the best of Central City and its lifestyle, the parks and recreation centre are next door, its steps to the SkyTrain</p>
                                </div>
                                <div className="m-2">
                                    <a role='button' href='#' className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Learn More</a>
                                </div>
                            </div>
                        ))}
                    </div>
                  </div>
                  <div className="hidden md:flex md:w-1/2 lg:w-1/2 my-4 mx-2 shadow-lg" style={{ height: "100vh" }} >
                    <div  style={{ width: "100%", height: "100vh" }} >
                      <MapContainer center={[49.2827, -123.1207]} zoom={13} scrollWheelZoom={false}>
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png" />
                          {listings.map(element => (
                            element.lat && element.lng && element.developer &&
                              <Marker position={[element.lat, element.lng]}>
                                <Popup>
                                  {element.developer.developerName}
                                </Popup>
                              </Marker>
                            ))             
                          }   
                      </MapContainer>
                    </div>
                  </div>
                </div>
              </div>
            </main>
        </div>
      </>
    )
}