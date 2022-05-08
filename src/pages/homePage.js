import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import { FilterIcon } from "@heroicons/react/outline";
import { SearchIcon } from "@heroicons/react/solid";
import { useState, useEffect } from "react";
import axios from "axios";
import Geocode from "react-geocode";
import { Dropdown } from "../components/Dropdown";
import { Link } from "react-router-dom";

const APIKEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const baseURL = "https://localhost:44340/api/home/";

Geocode.setApiKey(APIKEY);
Geocode.setRegion("ca");
Geocode.setLocationType("ROOFTOP");

export default function TestMap() {
  const [listings, setListings] = useState([]);
  const [coordinates, setCord] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    async function getListings() {
      const results = await axios.get(baseURL);
      const result = results.data;
      for (let i = 0; i < result.length; i++) {
        Geocode.fromAddress(
          result[i].streetNum +
            " " +
            result[i].streetName +
            " " +
            result[i].city +
            " " +
            result[i].postalCode
        ).then((response) => {
          const { lat, lng } = response.results[0].geometry.location;
          result[i].lat = lat;
          result[i].lng = lng;
          setCord([...coordinates, { lat: lat, lng: lng }]);
        });

        setDevelopers((developers) => [...developers, result[i].developer]);
      }

      setListings(result);
    }
    getListings();
  }, []);

  const distinctDevelopers = [
    ...new Set(developers.map((dev) => dev.developerName)),
  ];

  const distinctCities = [...new Set(listings.map((l) => l.project.city))];

  const Developers = distinctDevelopers.map((dev) => ({
    label: dev,
    value: dev,
  }));

  const Cities = distinctCities.map((city) => ({
    label: city,
    value: city,
  }));

  const SortBy = [
    { value: "newest", label: "Newest" },
    {
      value: "oldest",
      label: "Oldest",
    },
    {
      value: "expected",
      label: "Completion Date",
    },
    {
      value: "presale",
      label: "Presale",
    },
    {
      value: "soon",
      label: "Presale Starting Soon",
    },
    {
      value: "available",
      label: "Available Now",
    },
  ];

  const placeholder = `Search through ${listings.length} listings...`;

  async function searchListings(query) {
    var result;
    if (!query) {
      result = await axios.get(baseURL);
    } else {
      result = await axios.get(baseURL + `search/${query}`);
    }
    setListings(result.data);
  }

  async function filterByDeveloper(query) {
    const devName = query.value.toLowerCase();
    var results;
    if (!query) {
      results = await axios.get(baseURL);
    } else {
      results = await axios.get(baseURL + `developerName/${devName}`);
    }
    setListings(results.data);
  }

  async function filterByCity(city) {
    var results;
    if (!city) {
      results = await axios.get(baseURL);
    } else {
      results = await axios.get(baseURL + `city/${city}`);
    }
    setListings(results.data);
  }

  async function sortBy(value) {
    var results;
    if (!value) {
      results = await axios.get(baseURL);
    } else {
      results = await axios.get(baseURL + `sortby/${value}`);
    }
    setListings(results.data);
  }

  async function setStartDate(date) {
    var results;
    if (!date) {
      results = await axios.get(baseURL);
    } else {
      results = await axios.get(baseURL + `sort/${date}`);
    }
    setListings(results.data);
  }

  function toggleFilter() {
    console.log(hidden);
  }

  return (
    <>
      <div className="md:min-h-full md:py-10 bg-gray-100 lg:pt-0 ">
        <main>
          <div className="mb:bg-chairgreen-500 mb:mt-6 max-w-7xl mx-auto sm:px-6 lg:px-8 sm:rounded-[24px] ">

            
            <div className="sm:block md:flex md:justify-center items-center justify-between">
              <div className="Here">
              <div className="mb:justify-evenly mb:flex mb:px-4 mb:py-8 mb:pb-4 sm:w-full md:ml-2  flex-none md:w-600">
                <form className="w-wfa" onsubmit="">
                  <div className="relative">
                    <label>
                      <input
                        className="rounded-full py-2 pr-10 pl-10 w-wfa border border-gray-300 focus:border-gray-700 bg-white focus:bg-white focus:outline-none focus:shadow-md "
                        type="text"
                        placeholder={placeholder}
                        onChange={(event) => {
                          searchListings(event.target.value);
                        }}
                      />
                      <span className="absolute top-0 left-0 mt-2 ml-3 inline-block">
                        <svg viewBox="0 0 24 24" className="w-6 h-6">
                          <path
                            fill="#bbb"
                            d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
                          />
                        </svg>
                      </span>
                    </label>
                  </div>
                </form>
                <div>
                  <button
                    className="bg-transparent border-0 text-black float-right sm:pl-6"
                    onClick={() => setHidden((s) => !s)}
                  >
                    <span className="mb:inline-grid text-white opacity-7 h-9 w-16 text-xs block bg-gold-600 py-0 leading-4 rounded-full">
                      Show<br></br>Filters
                    </span>
                  </button>
                </div>
              </div>

              {!hidden ? (
                <div className="mb:flex mb:flex-col mb:p-4 mb:py-0 mb:gap-3 md:gap-0 md:flex-row md:justify-center md:py-4 md:px-4  lg:pr-16">
                  <Dropdown
                    onChange={(event) => {
                      filterByDeveloper(event);
                    }}
                    placeholder="Developer"
                    options={Developers}
                  />
                  <Dropdown
                    onChange={(event) => {
                      filterByCity(event.value);
                    }}
                    placeholder="City"
                    options={Cities}
                  />
                  <Dropdown
                    onChange={(event) => {
                      sortBy(event.value);
                    }}
                    placeholder="Sort By"
                    options={SortBy}
                  />
                  <div className="pl-1">
                    <input
                      className="mb:min-w-371  md:min-w-full h-full rounded-lg text-center"
                      type="date"
                      onChange={(event) => {
                        setStartDate(event.target.value);
                      }}
                    />
                  </div>
                </div>
              ) : null}

              </div>

              
            </div>

            <div className="mb:px-2 md:flex md:mb-4">
              {/* map container */}
              <div className="md:flex md:w-1/2 lg:w-1/2 my-4 mx-2 shadow-lg ">
                <div style={{ width: "100%" }}>
                  <MapContainer
                    center={[49.2827, -123.1207]}
                    zoom={11}
                    scrollWheelZoom={false}
                    className="rounded-xl w-20"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
                    />
                    {listings.map(
                      (element) =>
                        element.lat &&
                        element.lng &&
                        element.developer && (
                          <Marker position={[element.lat, element.lng]}>
                            <Popup>
                              <div className="w-64 p-2 bg-white rounded-xl transform transition-all shadow-lg">
                                <img
                                  className="h-40 object-cover rounded-xl"
                                  src={element.projectImage}
                                  alt=""
                                />
                                <div className="p-2">
                                  <h2 className="font-bold text-lg mb-2 ">
                                    {element.developer.developerName}
                                  </h2>
                                  <p className="text-sm text-gray-600">
                                    It gives you the best of Central City and
                                    its lifestyle, the parks and recreation
                                    centre are next door, its steps to the
                                    SkyTrain
                                  </p>
                                </div>
                                <div className="m-2">
                                  <a
                                    role="button"
                                    href="#"
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-chairgreen-600 hover:bg-chairgreen-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-chairgreen-500"
                                  >
                                    Learn More
                                  </a>
                                </div>
                              </div>
                            </Popup>
                          </Marker>
                        )
                    )}
                  </MapContainer>
                </div>
              </div>

              <div className="w-full md:w-1/2 gap-4 flex flex-wrap">
                <div className="w-full md:max-h-[70vh] gap-6 flex-wrap flex justify-center overflow-auto pb-4 my-6">
                  {listings.map((i) => (
                    <div className="w-64 max-h-394 p-2 bg-white rounded-xl transform transition-all shadow-lg">
                      <img
                        className="h-40 object-cover rounded-xl"
                        src={i.project.projectImage}
                        alt=""
                      />
                      <div className="p-2">
                        <h2 className="tracking-widest text-xs title-font font-medium mb-1">
                          {i.developer.developerName}
                        </h2>
                        <h2 className="font-bold text-lg">
                          {i.project.projectName}
                        </h2>
                        <p className="text-sm">
                          {i.project.projectDescription}
                        </p>
                      </div>
                      <div className="m-2">
                        <p className="text-sm">
                          Status: {i.project.projectStatus}
                        </p>
                        <p className="text-sm">Posted: {i.project.created}</p>
                        <p className="text-sm">{i.project.city}</p>
                        <p className="text-sm">
                          Expected completion: {i.project.expectedCompletion}
                        </p>
                        <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-chairgreen-600 hover:bg-chairgreen-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-chairgreen-500">
                          <Link to={`/listings/${i.project.projectId}`}>
                            Read More
                          </Link>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
