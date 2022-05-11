import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import { useState, useEffect } from "react";
import axios from "axios";
import Geocode from "react-geocode";
import { Dropdown } from "../components/Dropdown";
import { Link } from "react-router-dom";
import defaultImage from "../images/project-default.png";
import BounceLoader from "react-spinners/FadeLoader";

const APIKEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const baseURL = process.env.REACT_APP_GLOBAL_API + "api/home/";

Geocode.setApiKey(APIKEY);
Geocode.setRegion("ca");
Geocode.setLocationType("ROOFTOP");

export default function TestMap() {
  const [listings, setListings] = useState([]);
  const [coordinates, setCord] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [cities, setCities] = useState([]);
  const [hidden, setHidden] = useState(true);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    async function getListings() {
      setTimeout(() => {
        setShowLoader(false);
      }, 600);
      const results = await axios.get(baseURL);
      const result = results.data;
      for (let i = 0; i < result.length; i++) {
        Geocode.fromAddress(
          result[i].project.streetNum +
            " " +
            result[i].project.streetName +
            " " +
            result[i].project.city +
            " " +
            result[i].project.postalCode
        ).then((response) => {
          const { lat, lng } = response.results[0].geometry.location;
          result[i].project.lat = lat;
          result[i].project.lng = lng;
          setCord([...coordinates, { lat: lat, lng: lng }]);
        });
      }
      const distinctDevelopers = [
        ...new Set(result.map((dev) => dev.developer.developerName)),
      ];
      const distinctCities = [...new Set(result.map((l) => l.project.city))];
      setDevelopers(distinctDevelopers);
      setCities(distinctCities);
      setListings(result);
      console.log(result);
    }
    getListings();
  }, []);

  function geoCodeAddress(list) {
    for (let i = 0; i < list.length; i++) {
      Geocode.fromAddress(
        list[i].project.streetNum +
          " " +
          list[i].project.streetName +
          " " +
          list[i].project.city +
          " " +
          list[i].project.postalCode
      ).then((response) => {
        const { lat, lng } = response.results[0].geometry.location;
        list[i].project.lat = lat;
        list[i].project.lng = lng;
        setCord([...coordinates, { lat: lat, lng: lng }]);
      });
    }
    return list;
  }

  const Developers = developers.map((dev) => ({
    label: dev,
    value: dev,
  }));

  const Cities = cities.map((city) => ({
    label: city,
    value: city,
  }));

  const options = { year: "numeric", month: "long", day: "numeric" };
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
    var results;
    if (!query) {
      results = await axios.get(baseURL);
    } else {
      results = await axios.get(baseURL + `search/${query}`);
    }
    const result = geoCodeAddress(results.data);
    setListings(result);
  }

  async function filterByDeveloper(query) {
    const devName = query.value.toLowerCase();
    var results;
    if (!query) {
      results = await axios.get(baseURL);
    } else {
      results = await axios.get(baseURL + `developerName/${devName}`);
    }
    const result = geoCodeAddress(results.data);
    setListings(result);
  }

  async function filterByCity(city) {
    var results;
    if (!city) {
      results = await axios.get(baseURL);
    } else {
      results = await axios.get(baseURL + `city/${city}`);
    }
    const result = results.data;
    const list = geoCodeAddress(result);
    setListings(list);
  }

  async function sortBy(value) {
    var results;
    if (!value) {
      results = await axios.get(baseURL);
    } else {
      results = await axios.get(baseURL + `sortby/${value}`);
    }
    const result = geoCodeAddress(results.data);
    setListings(result);
  }

  async function setStartDate(date) {
    var results;
    if (!date) {
      results = await axios.get(baseURL);
    } else {
      results = await axios.get(baseURL + `sort/${date}`);
    }
    const result = geoCodeAddress(results.data);
    setListings(result);
  }

  return (
    <>
      {showLoader ? (
        <div className="flex justify-center items-center h-screen">
          <BounceLoader color={"#2e5351"} loading={true} size={100} />
        </div>
      ) : (
        <div className="md:min-h-full md:py-10 bg-gray-100  ">
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
                        className="h-full relative inline-flex items-center px-2 py-2 mx-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gold-500 hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gold-800 focus:ring-gold-500"
                        onClick={() => setHidden((s) => !s)}
                      >
                        Filters▼
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
                      scrollWheelZoom={true}
                      className="rounded-xl w-20"
                    >
                      <TileLayer url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png" />
                      {listings.map(
                        (element) =>
                          element.project.lat &&
                          element.project.lng &&
                          element.developer && (
                            <Marker
                              position={[
                                element.project.lat,
                                element.project.lng,
                              ]}
                            >
                              <Popup autoPanPadding={true}>
                                <div className="p-1">
                                  <img
                                    className="rounded-t min-w-full"
                                    src={
                                      element.project.projectImage
                                        ? element.project.projectImage
                                        : defaultImage
                                    }
                                    alt={element.project.projectName}
                                  />
                                  <h2 className="font-bold text-lg mb-1">
                                    {element.project.projectName}
                                  </h2>
                                  <p className="text-sm text-gray-600">
                                    Address:{" "}
                                    {element.project.streetNum +
                                      " " +
                                      element.project.streetName +
                                      ", " +
                                      element.project.city}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Developer Name:{" "}
                                    {element.developer.developerName}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Date Created:{" "}
                                    {new Date(
                                      element.project.created
                                    ).toLocaleDateString(undefined, options)}
                                  </p>
                                </div>
                                <div>
                                  <Link
                                    to={`/listings/${element.project.projectId}`}
                                  >
                                    <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-chairgreen-600 hover:bg-chairgreen-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-chairgreen-500">
                                      Read More
                                    </button>
                                  </Link>
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
                          className="rounded-t min-w-full h-40"
                          src={
                            i.project.projectImage
                              ? i.project.projectImage
                              : defaultImage
                          }
                          alt={i.project.projectName}
                        />
                        <div className="p-2">
                          <h2 className="tracking-widest text-xs title-font font-medium mb-1">
                            {i.developer.developerName}
                          </h2>
                          <h2 className="font-bold text-lg">
                            {i.project.projectName}
                          </h2>
                          <p className="text-sm truncate">
                            {i.project.projectDescription}
                          </p>
                        </div>
                        <div className="m-2">
                          <Link to={`/listings/${i.project.projectId}`}>
                            <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-chairgreen-600 hover:bg-chairgreen-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-chairgreen-500">
                              Read More
                            </button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </>
  );
}
