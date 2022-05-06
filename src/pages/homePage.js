import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import { FilterIcon } from '@heroicons/react/outline';
import { SearchIcon} from '@heroicons/react/solid';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Geocode from "react-geocode";
import { Dropdown } from "../components/Dropdown";
import { Link } from 'react-router-dom';

const APIKEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY
const baseURL = 'https://localhost:44340/api/home/'

Geocode.setApiKey(APIKEY);
Geocode.setRegion("ca");
Geocode.setLocationType("ROOFTOP");

export default function TestMap() {
    const [listings, setListings] = useState([])
    const [coordinates, setCord] = useState([])
    const [developers, setDevelopers] = useState([])
    const [cities, setCities] = useState([])


    useEffect(() => {
        async function getListings() {
            const results = await axios.get(baseURL)
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

              // console.log(result[i].developer)

              
             
              // setDevelopers([...developers, result[i].developer])  
       
              // setDevelopers([...developers, result[i].developer])

              setDevelopers(developers => [...developers, result[i].developer])
            }
            // console.log(oldArr)
            
            setListings(result)
            
            // setDevelopers(developers, ...new Set(listings.map((listing) => listing.developer)))
            
          }    
 


        getListings()
        
    }, [])


    const distinctCities = [
      ...new Set(listings.map((listing) => listing.city)),
    ];
    const distinctDevelopers = [
      ...new Set(developers.map((dev) => dev.developerName)),
    ];

    const Cities = distinctCities.map((city) => ({
      label: city,
      value: city,
    }));
    
    const Developers = distinctDevelopers.map((dev) => ({
      label: dev,
      value: dev
    }));


  async function filterByDeveloper(query) {
    console.log(query)
    var result;
    if (!query) {
      result = await axios.get(
        baseURL
      );
    } else {
      result = await axios.get(baseURL+`developerName/${query.value}`);
    }
    console.log((baseURL+`developerName/${query.value}`))
    console.log(result)
    setListings(result);
  }
    


    async function filterByCity(city) {
      // console.log(city)
      const result = await axios.get(baseURL+`city/${city}`, {
      });
      setListings(result.data);
      // if (result.data.length > 0) {
      //   displayProfile(result.data[0]);
      // }
    }

    return(
        <>
        <div className="min-h-full py-10 bg-gray-100 ">
          <main>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 sm:rounded-[24px] bg-white">
              <div className="flex mb-4">
                <div className='w-full md:w-1/2 gap-4 flex flex-wrap'>
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
                        <FilterIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                        <span className="sr-only">Search</span>
                      </button>
                    </form>

          
                    <div className="filter-container flex">
      
                      <Dropdown onChange={(event) => {filterByCity(event.value)}} placeholder="Filter by City" options={Cities}/>
                      <Dropdown onChange={(event) => {filterByDeveloper(event)}} placeholder="Filter by Developer" options={Developers}/>
                      <Dropdown onChange={(event) => {filterByCity(event.value)}} placeholder="Filter by Date" options={Cities}/>
       
                    </div>
                    <div className='w-full md:max-h-screen gap-6 flex-wrap flex justify-center overflow-auto pb-4'>

                        {listings.map(i => (
                            <div className="w-64 p-2 bg-white rounded-xl transform transition-all shadow-lg">
                                <img className="h-40 object-cover rounded-xl" src={i.projectImage} alt="" />
                                <div className="p-2">
                                  <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">{i.developer.developerName}</h2>
                                  <h2 className="font-bold text-lg mb-2 ">{i.projectName}</h2>
                                  <p className="text-sm text-gray-600">{i.projectDescription}</p>
                                </div>
                                <div className="m-2">
                                  <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-chairgreen-600 hover:bg-chairgreen-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-chairgreen-500">
                                    <Link to={`/listings/${i.projectId}`}>Read More</Link>
                                  </button>
                                </div>
                            </div>
                        ))}


                    </div>
                  </div>
                  <div className="hidden md:flex md:w-1/2 lg:w-1/2 my-4 mx-2 shadow-lg" style={{ height: "100vh" }} >
                    <div  style={{ width: "100%", height: "100vh" }} >
                      <MapContainer center={[49.2827, -123.1207]} zoom={10} scrollWheelZoom={false}>
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png" />
                          {listings.map(element => (
                            element.lat && element.lng && element.developer &&
                              <Marker position={[element.lat, element.lng]}>
                                <Popup>
                                <div className="w-64 p-2 bg-white rounded-xl transform transition-all shadow-lg">
                                <img className="h-40 object-cover rounded-xl" src={element.projectImage} alt="" />
                                <div className="p-2">
                                    <h2 className="font-bold text-lg mb-2 ">{element.developer.developerName}</h2>
                                    <p className="text-sm text-gray-600">It gives you the best of Central City and its lifestyle, the parks and recreation centre are next door, its steps to the SkyTrain</p>
                                </div>
                                <div className="m-2">
                                    <a role='button' href='#' className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-chairgreen-600 hover:bg-chairgreen-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-chairgreen-500">Learn More</a>
                                </div>
                              </div>
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