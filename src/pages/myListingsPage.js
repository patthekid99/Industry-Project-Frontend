import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import defaultImage from "../images/project-default.png";
import BounceLoader from "react-spinners/FadeLoader";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import Geocode from "react-geocode";
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";

const SASTOKEN = process.env.REACT_APP_SAS_KEY;
const APIKEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
Geocode.setApiKey(APIKEY);
Geocode.setRegion("ca");
Geocode.setLocationType("ROOFTOP");

const IMAGEBUCKETURL = process.env.REACT_APP_IMAGE_URL;

export default function MyListingsPage() {
  const [listings, setListings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [token, setToken] = useState("");
  const BASEURL = process.env.REACT_APP_GLOBAL_API + "api/listing/";
  const [showLoader, setShowLoader] = useState(true);
  const [project, setProject] = useState({});
  const [marker, setMarker] = useState({ lat: 49.2827, lng: -123.1207 });
  const [imageFile, setImageFile] = useState(null);

  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    setTimeout(() => {
      setShowLoader(false);
    }, 600);
    getMyListings();
  }, []);
  async function getMyListings() {
    var myToken = JSON.parse(localStorage.getItem("myData")).tokenString;
    setToken(myToken);
    const result = await axios.get(BASEURL, {
      headers: {
        Authorization: `Bearer ${myToken}`,
      },
    });
    setListings(result.data);
  }
  const onChange = (e) => {
    e.persist();
    setProject({
      ...project,
      [e.target.name]: e.target.value,
    });
  };

  const onFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };
  const uploadFile = async (name) => {
    let storageAccountName = "whatsonpresalestorage";
    let sasToken = SASTOKEN;
    const blobService = new BlobServiceClient(
      `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
    );
    //get container - full public read access
    const containerClient = blobService.getContainerClient("myfile");
    await containerClient.createIfNotExists({
      access: "container",
    });
    //create blobClient for container
    const blobClient = containerClient.getBlockBlobClient(name);
    //set mimetype as determined from borwser with file upload control
    const options = { blobHTTPHeaders: { blobContentType: imageFile.type } };
    //upload file
    await blobClient.uploadBrowserData(imageFile, options);
  };

  const getlistingbyID = async (id) => {
    const result = await axios.get(`${BASEURL + id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const resultListing = result.data[0].project;
    setProject(resultListing);
  };

  const updateListing = async (e) => {
    e.preventDefault();
    var projectData;
    const picname = uuidv4();
    if (imageFile != null) {
      uploadFile(picname);
      projectData = { ...project, projectImage: picname };
    } else {
      projectData = { ...project };
    }

    const result = await axios.put(BASEURL, projectData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    alert("listing updated");
    setShowModal(false);
    getMyListings();
  };
  const deleteListing = async (id) => {
    const result = await axios.delete(`${BASEURL + id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    alert("listing deleted");
    getMyListings();
  };
  const openEdit = async (id) => {
    getlistingbyID(id);
    setTimeout(() => {
      setShowModal(true);
    }, 500);
  };

  const showListing = async (id) => {
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
          {showModal ? (
            <>
              <div className="justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-9 z-50 outline-none focus:outline-none">
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                      <h3 className="text-3xl font-semibold">
                        Update Project Information
                      </h3>
                      <button
                        className="bg-transparent border-0 text-black float-right"
                        onClick={() => setShowModal(false)}
                      >
                        <span className="text-white opacity-7 h-6 w-6 text-xl block bg-chairgreen-500 py-0 leading-5 rounded-full">
                          x
                        </span>
                      </button>
                    </div>
                    <div className="relative p-6 flex-auto">
                      <form
                        className="justify-center items-center"
                        onSubmit={(e) => updateListing(e)}
                      >
                        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                          <div className="sm:col-span-2">
                            <label
                              htmlFor="projectName"
                              className="text-sm font-medium text-blue-gray-900"
                            >
                              Project Name
                            </label>
                            <input
                              type="text"
                              name="projectName"
                              id="projectName"
                              placeholder="Project Name"
                              className="form-input rounded-lg mt-1 p-2 block w-full border-2 border-gray-300 shadow-sm text-blue-gray-900 sm:text-sm focus:ring-chairgreen-400 focus:border-chairgreen-400"
                              defaultValue={project.projectName}
                              onChange={onChange}
                            />
                          </div>

                          <div className="block">
                            <label
                              htmlFor="streetNum"
                              className="text-sm font-medium text-blue-gray-900"
                            >
                              Street Number
                            </label>
                            <input
                              type="text"
                              name="streetNum"
                              id="streetNum"
                              placeholder="Street Number"
                              className="form-input rounded-lg mt-1 p-2 block w-full border-2 border-gray-300 shadow-sm text-blue-gray-900 sm:text-sm focus:ring-chairgreen-400 focus:border-chairgreen-400"
                              defaultValue={project.streetNum}
                              onChange={onChange}
                            />
                          </div>

                          <div className="block">
                            <label
                              htmlFor="StreetName"
                              className="text-sm font-medium text-blue-gray-900"
                            >
                              Street Name
                            </label>
                            <input
                              type="text"
                              name="streetName"
                              id="streetName"
                              placeholder="Street Name"
                              className="form-input rounded-lg mt-1 p-2 block w-full border-2 border-gray-300 shadow-sm text-blue-gray-900 sm:text-sm focus:ring-chairgreen-400 focus:border-chairgreen-400"
                              defaultValue={project.streetName}
                              onChange={onChange}
                            />
                          </div>

                          <div className="block">
                            <label
                              htmlFor="city"
                              className="text-sm font-medium text-blue-gray-900"
                            >
                              City
                            </label>
                            <input
                              type="text"
                              name="city"
                              id="city"
                              placeholder="city"
                              className="form-input rounded-lg mt-1 p-2 block w-full border-2 border-gray-300 shadow-sm text-blue-gray-900 sm:text-sm focus:ring-chairgreen-400 focus:border-chairgreen-400"
                              defaultValue={project.city}
                              onChange={onChange}
                            />
                          </div>

                          <div className="block">
                            <label
                              htmlFor="postalCode"
                              className="text-sm font-medium text-blue-gray-900"
                            >
                              Postal Code
                            </label>
                            <input
                              type="text"
                              name="postalCode"
                              id="postalCode"
                              placeholder="Postal Code"
                              className="form-input rounded-lg mt-1 p-2 block w-full border-2 border-gray-300 shadow-sm text-blue-gray-900 sm:text-sm focus:ring-chairgreen-400 focus:border-chairgreen-400"
                              defaultValue={project.postalCode}
                              onChange={onChange}
                            />
                          </div>

                          <div className="block sm:col-span-2">
                            <label
                              labelFor="projectDescription"
                              className="text-sm font-medium text-gray-900"
                            >
                              Description
                              <textarea
                                name="projectDescription"
                                id="projectDescription"
                                rows={4}
                                className="form-textarea rounded-lg mt-1 p-2 block w-full border-2 border-gray-300 shadow-sm text-blue-gray-900 sm:text-sm focus:ring-chairgreen-400 focus:border-chairgreen-400"
                                placeholder="Describe the project in few words."
                                defaultValue={project.projectDescription}
                                onChange={onChange}
                              />
                            </label>
                          </div>

                          <div className="sm:col-span-2 mb:col-span-1">
                            <label
                              htmlFor="projectImage"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Image
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <input
                                type="file"
                                name="projectImage"
                                id="projectImage"
                                className="form-input focus:outline flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 focus:ring-chairgreen-400 focus:border-chairgreen-400"
                                onChange={onFileChange}
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-2 mb:col-span-1 pb-6">
                            <label
                              htmlFor="projectLink"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Website URL
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                https://
                              </span>
                              <input
                                type="text"
                                name="projectLink"
                                id="projectLink"
                                className="form-input focus:outline focus:ring-chairgreen-500 focus:border-chairgreen-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                placeholder="www.example.com"
                                defaultValue={project.projectLink}
                                onChange={onChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex col-start-2 items-center justify-end p-4 rounded-b border-t border-solid border-blueGray-200">
                          <button
                            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                            type="button"
                            onClick={() => setShowModal(false)}
                          >
                            Close
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 font-semibold text-sm bg-chairgreen-500 text-white rounded-md shadow-sm hover:-translate-y-1 hover:scale-110 hover:bg-chairgreen-700 ease-in-out delay-150 duration-300"
                          >
                            Save Changes
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}

          {showDetails ? (
            <>
              <div className="justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-9 z-50 outline-none focus:outline-none">
                <div className="relative w-auto my-6 mx-auto max-w-7xl">
                  <div className="border-0 rounded-lg shadow-lg flex flex-col w-full bg-white outline-none focus:outline-none">
                    <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
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
                                      Project Status
                                    </span>
                                    <span className="ml-auto text-gray-900">
                                      {project.projectStatus}
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
              </div>
            </>
          ) : null}

          <div className="min-h-screen py-10 bg-gray-100">
            <div className="max-w-7xl sm:px-6 lg:px-8 mb:rounded-[24px] mx-auto bg-white container">
              <div className="py-4 grid grid-cols-3 grid-flow-cols gap-9 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 sm:gap-x-6 mb:grid-cols-1">
                {listings?.map((listing) => (
                  <>
                    <div
                      className="pb-4 shadow-2xl group container  transform transition-all hover:-translate-y-2 duration-300 
                                rounded-md bg-white max-w-xs flex justify-center rounded-t-lg  mx-auto"
                    >
                      <div className="flex-wrap flex">
                        <div className="absolute p-2 m-4 w-16 h-16 text-center bg-gray-700 rounded-full text-white right-0 group-hover:opacity-25">
                          <span className="text-base tracking-wide font-bold border-b border-white font-sans">
                            {new Date(
                              Date.parse(listing.project.created)
                            ).getDate()}
                          </span>
                          <span className="text-xs tracking-wide font-bold uppercase block font-sans">
                            {
                              months[
                                new Date(
                                  Date.parse(listing.project.created)
                                ).getMonth()
                              ]
                            }
                          </span>
                        </div>
                        <div className="mx-auto object-cover w-full rounded-t-md">
                          <img
                            className="rounded-t min-w-full"
                            src={
                              listing.project.projectImage
                                ? IMAGEBUCKETURL + listing.project.projectImage
                                : defaultImage
                            }
                            alt={listing.project.projectName}
                          />
                        </div>
                        <div className="pt-8 pb-4 px-4 bg-white w-full rounded-b-md fd-cl group-hover:opacity-25">
                          <span className="block text-lg text-gray-800 font-bold tracking-wide">
                            {listing.project.projectName}
                          </span>
                          <span className="block text-gray-600 text-sm">
                            {listing.project.projectDescription}.<br />
                          </span>
                        </div>
                        {/* ----------Read More button------------ */}
                        {/* <div className="block pl-4 pt-4 text-gray-600 text-sm">  
                          <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-xl text-sm font-medium rounded-md 
                            text-white bg-chairgreen-600 hover:bg-chairgreen-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-chairgreen-500
                            z-50">
                            <Link className="text-white"
                                to={`/listings/${listing.projectId}`}>
                              Read more </Link>
                          </button>
                      </div> */}
                      </div>
                      <div className="absolute w-full h-full opacity-0 hover:opacity-100 transform transition-all ease-in-out  duration-300">
                        <img
                          className="blur-sm object-cover rounded-t min-w-full min-h-full opacity-100"
                          src={
                            listing.project.projectImage
                              ? IMAGEBUCKETURL + listing.project.projectImage
                              : defaultImage
                          }
                          alt={listing.project.projectName}
                        />
                        <div className="absolute p-2 inset-0 opacity-0 hover:opacity-100">
                          <div>
                            <h2 className="block mx-auto sm:px-6 lg:px-8 sm:rounded-[24px] text-center pb-4 font-bold text-2xl ">
                              <p
                                className="text-chairgreen-600 hover:text-gold-500"
                                onClick={() =>
                                  showListing(listing.project.projectId)
                                }
                              >
                                {listing.project.projectName}
                              </p>
                            </h2>
                          </div>
                          <div className="flex flex-col max-h-full">
                            <div className="pt-8 text-center">
                              <button
                                className="bg-chairgreen-600 text-white active:bg-chairgreen-400 text-center text-lg
                                              font-bold px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                                type="button"
                                onClick={() =>
                                  openEdit(listing.project.projectId)
                                }
                              >
                                Edit
                              </button>
                            </div>
                            <div className="pt-8 text-center">
                              <button
                                className="bg-chairgreen-600 text-red-500 active:bg-chairgreen-400 text-center text-lg
                                              font-bold px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                                type="button"
                                onClick={() =>
                                  deleteListing(listing.project.projectId)
                                }
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ))}
                <li class="flex">
                  <Link
                    to={"/newlisting"}
                    className="hover:border-chairgreen-400 hover:border-solid hover:bg-white hover:text-chairgreen-400 group w-full flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-sm leading-6 text-slate-900 font-medium py-3"
                  >
                    <svg
                      class="group-hover:text-chairgreen-400 mb-1 text-slate-400"
                      width="20"
                      height="20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
                    </svg>
                    New project
                  </Link>
                </li>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
