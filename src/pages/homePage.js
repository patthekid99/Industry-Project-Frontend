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

const IMAGEBUCKETURL = process.env.REACT_APP_IMAGE_URL;

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
  const [showDetails, setShowDetails] = useState(false);
  const [project, setProject] = useState({});
  const [marker, setMarker] = useState({ lat: 49.2827, lng: -123.1207 });
  const [token, setToken] = useState("");

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

  const getlistingbyID = async (id) => {
    var myToken = JSON.parse(localStorage.getItem("myData")).tokenString;
    setToken(myToken);
    const result = await axios.get(`${baseURL + id}`);
    const resultListing = result.data[0].project;
    setProject(resultListing);
  };

  const showListing = (id) => {
    getlistingbyID(id);
    Geocode.fromAddress(
      project.streetNum +
        " " +
        project.streetName +
        " " +
        project.city +
        " " +
        project.postalCode
    ).then((response) => {
      const { lat, lng } = response.results[0].geometry.location;
      project.lat = lat;
      project.lng = lng;
      setMarker({ lat: lat, lng: lng });
    });
    setTimeout(() => {
      setShowDetails(true);
    }, 500);
  };

  return (
    <>
      {showLoader ? (
        <div className="flex justify-center items-center h-screen">
          <BounceLoader color={"#2e5351"} loading={true} size={100} />
        </div>
      ) : (
        <>
          {showDetails ? (
            <>
              <div className="backdrop-blur-lg bg-black/30 w-screen h-screen overflow-x-hidden overflow-y-auto fixed inset-0 z-[99] outline-none focus:outline-none">
                  <div className="border-0 max-w-[70%] m-auto absolute  top-12 inset-x-10 rounded-lg shadow-lg flex flex-col place-items-center bg-white outline-none focus:outline-none">
                    <div className="flex items-center justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                      <main>
                        <div className="max-w-7xl mx-auto sm:rounded-[24px] bg-white">
                          <section className="text-gray-600 body-font overflow-hidden">
                            <div className="container px-5 py-5 mx-auto">
                              <button
                                className="bg-transparent border-0 text-black float-right"
                                onClick={() => setShowDetails(false)}
                              >
                                <span className="text-white opacity-7 h-6 w-6 text-xl block bg-chairgreen-500 py-0 leading-5 rounded-full">
                                  x
                                </span>
                              </button>
                              <div className="lg:w-4/5 mx-auto flex flex-wrap">
                                <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
                                  <h2 className="text-sm title-font text-gray-500 tracking-widest">
                                    {project.developerName}
                                  </h2>
                                  <h1 className="text-gray-900 text-3xl title-font font-medium mb-4">
                                    {project.projectName}
                                  </h1>
                                  <p className="leading-relaxed mb-4">
                                    {project.projectDescription}
                                  </p>
                                  <div className="flex border-t border-gray-200 py-2">
                                    <span className="text-gray-500">
                                      Address
                                    </span>
                                    <span className="ml-auto text-gray-900">
                                      {project.streetNum +
                                        " " +
                                        project.streetName +
                                        ", " +
                                        project.city}
                                    </span>
                                  </div>
                                  <div className="flex border-t border-b mb-6 border-gray-200 py-2">
                                    <span className="text-gray-500">
                                      Project Link
                                    </span>
                                    <span className="ml-auto text-gray-900">
                                      {project.projectLink}
                                    </span>
                                  </div>
                                  <div
                                    className="flex pb-2"
                                    style={{ height: "30vh" }}
                                  >
                                    <MapContainer
                                      center={[marker.lat, marker.lng]}
                                      zoom={14}
                                      scrollWheelZoom={false}
                                      style={{ height: "30vh" }}
                                    >
                                      <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
                                      />
                                      <Marker
                                        position={[marker.lat, marker.lng]}
                                      ></Marker>
                                    </MapContainer>
                                  </div>
                                </div>
                                <img
                                  alt="ecommerce"
                                  className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
                                  src={
                                    project.projectImage
                                      ? IMAGEBUCKETURL + project.projectImage
                                      : defaultImage
                                  }
                                />
                              </div>
                            </div>
                          </section>
                        </div>
                      </main>
                    </div>
                  </div>
              </div>
            </>
          ) : null}
          <div className="md:min-h-full bg-gray-100">
            <main>
            <div className=" block md:hidden md:justify-center items-center justify-between">
                  <div className="Here">
                    <div className="mb:justify-evenly mb:flex mb:px-4 mb:py-8 mb:pb-4 sm:w-full md:ml-2  flex-none md:w-600">
                      <form className="w-wfa" onSubmit="">
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
               

                <div className="md:flex bg-gray-100">
                  {/* map container */}
                  <div
                    className={`${
                      showDetails ? "hidden md:hidden lg:hidden" : ""
                    } md:flex md:w-2/3 lg:w-2/3 shadow-lg `}
                  >
                    <div style={{ width: "100%", height: "100%"}}>
                      <MapContainer
                        center={[49.2827, -123.1207]}
                        zoom={11}
                        scrollWheelZoom={true}
                        className="w-20"
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
                                <Popup Pan={true}>
                                  <div className="p-1">
                                    <img
                                      className="rounded-t min-w-full"
                                      src={
                                        element.project.projectImage
                                          ? IMAGEBUCKETURL +
                                            element.project.projectImage
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
                                    <button
                                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-chairgreen-600 hover:bg-chairgreen-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-chairgreen-500"
                                      onClick={() =>
                                        showListing(element.project.projectId)
                                      }
                                    >
                                      Read More
                                    </button>
                                  </div>
                                </Popup>
                              </Marker>
                            )
                        )}
                      </MapContainer>
                    </div>
                  </div>

                  <div className="w-full md:w-1/3 flex-wrap bg-gray-100 p-2">
                  <div className="hidden md:flex w-full md:justify-center items-top justify-between h-min">
                  <div className="Here">
                  <div className="mb:justify-evenly mb:flex mb:px-2 mb:pt-2 mb:pb-2 md:w-full md:m-2 flex-none">
                      <form className="w-full">
                      <div /*className="relative"*/>
                          <label>
                            <input
                              className="rounded-full py-2 pr-10 pl-10 w-full border border-gray-300 focus:border-gray-700 bg-white focus:bg-white focus:outline-none focus:shadow-md "
                              type="text"
                              placeholder={placeholder}
                              onChange={(event) => {
                                searchListings(event.target.value);
                              }}
                            />
                            <span className="absolute top-0 left-0 mt-2 ml-3 inline-block w-1/4">
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
                      <div className="mb:flex mb:flex-col mb:p-2 mb:py-0 mb:gap-3 mb-2">
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
                    <div className="w-full md:max-h-[80vh] gap-6 flex-wrap flex justify-center justify-self-end overflow-auto pb-4 my-2">
                      {listings.map((i) => (
                        <div className="w-80 max-h-394 p-2 bg-white rounded-xl transform transition-all shadow-lg">
                          <img
                            className="rounded-t min-w-full h-40"
                            src={
                              i.project.projectImage
                                ? IMAGEBUCKETURL + i.project.projectImage
                                : defaultImage
                            }
                            alt={i.project.projectName}
                          />
                          <div className="p-2">
                            <h2 className="tracking-widest text-xs title-font font-medium">
                              {i.developer.developerName}
                            </h2>
                            <h2 className="font-bold text-lg">
                              {i.project.projectName}
                            </h2>
                          </div>
                          <div className="mx-2">
                            <button
                              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-chairgreen-600 hover:bg-chairgreen-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-chairgreen-500"
                              onClick={() => showListing(i.project.projectId)}
                            >
                              Read More
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
             
            </main>
          </div>
        </>
      )}
    </>
  );
}