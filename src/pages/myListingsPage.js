import { useState, useEffect } from 'react';
import axios from 'axios';
import data from '../Listing_MOCK_DATA.json'
import '../myListing.css'
import { Link, useNavigate} from "react-router-dom";

export default function MyListingsPage() {
    const navigate = useNavigate
    const [listings, setListings] = useState([])
    const [showModal, setShowModal] = useState(false);

    const [project, setProject] = useState({
      projectDetail:{}
    });

    const onChange = (e) => {
      e.persist();
      setProject({
          ...project,
          projectDetail: {...project.projectDetail, [e.target.name]:e.target.value }
      });
    };

    useEffect(() => {
        async function getMyListings() {
             // var token = {"tokenString":"eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjVhMmRhYTBhLWFiOWItNDIyZi1hN2MwLTI4OTA4N2JjNjNiYyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6ImRldmVsb3BlckB0ZXN0LmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkRldmVsb3BlciIsImV4cCI6MTY1MTU3MDA1MywiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NDQzNDAvIiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NDQzNDAvIn0.xFE53d6ySLVQvFwF7N5puNBmHi9SuHR7h1nNHy_Ll7u0CCESIxEcAGsy5EOkNBYmnuQlRuD3ihKWfDZ5M2Od9A"}
            
            // localStorage.setItem("myData",JSON.stringify(token))
            // var mydata = JSON.parse(localStorage.getItem("myData"))
            // if(mydata && mydata.tokenString){
            //     const result = await axios.get('https://localhost:44340/api/Listing/', {
            //         headers: {
            //             Authorization: `Bearer ${mydata.tokenString}`
            //         }
            //     })
                // const developerListings = result.data
                const developerListings = data
                await setListings(developerListings)
                console.log(developerListings)
            // }
            // else{
            //     console.log('no auth user')
            // }
        }
        getMyListings()
    }, [])

    const getlistingbyID = async (id) => {
        var mydata = JSON.parse(localStorage.getItem("myData"));
        const result = await axios.get(`https://localhost:44340/api/listings/${id}`, {
          headers: {
            Authorization: `Bearer ${mydata.tokenString}`,
          },
        });
        const resultListing = result.data;
        setProject(resultListing);
        console.log(resultListing);
    };

    const updateListing = async() => {
      // Update Listing
      const projectData = project.projectDetail
      var mydata = JSON.parse(localStorage.getItem("myData"));
      const result = await axios.put(`https://localhost:44340/api/listings/`, {
        headers: {
          Authorization: `Bearer ${mydata.tokenString}`,
        },
        data: {projectData}
      });
      console.log(result.data);
      alert("listing updated");
      setShowModal(false)
      navigate('/listings')
    }
    const deleteListing = async(id) => {
      // Delete a listing
      var mydata = JSON.parse(localStorage.getItem("myData"));
      const result = await axios.delete(`https://localhost:44340/api/listings/${id}`, {
        headers: {
          Authorization: `Bearer ${mydata.tokenString}`,
        },
      });
      console.log(result.data);
      alert("listing deleted");
      navigate('/listings')
    }

    return (
      <>
        {showModal ? (
        <>
          {getlistingbyID}
            <div className="justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-9 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                      <h3 className="text-3xl font-semibold">Update Project Information</h3>
                  <button className="bg-transparent border-0 text-black float-right" onClick={() => setShowModal(false)}>
                      <span className="text-white opacity-7 h-6 w-6 text-xl block bg-chairgreen-500 py-0 leading-5 rounded-full">
                          x
                      </span>
                  </button>
              </div>
              <div className="relative p-6 flex-auto">
                <form className="justify-center items-center" onSubmit={updateListing}>
                  <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">

                    <div className="sm:col-span-2">
                      <label htmlFor="projectName" className="text-sm font-medium text-blue-gray-900">
                        Project Name
                      </label>
                      <input  type="text" 
                              name="projectName" 
                              id="projectName" 
                              placeholder="Project Name" 
                              className="form-input rounded-lg mt-1 p-2 block w-full border-2 border-gray-300 shadow-sm text-blue-gray-900 sm:text-sm focus:ring-chairgreen-400 focus:border-chairgreen-400" 
                              defaultValue={project.projectName}
                              onChange={onChange}
                      />
                    </div>

                    <div className="block">
                      <label htmlFor="streetNum" className="text-sm font-medium text-blue-gray-900">
                          Street Number
                      </label>
                      <input  type="text" 
                              name="streetNum" 
                              id="streetNum"
                              placeholder="Street Number"
                              className="form-input rounded-lg mt-1 p-2 block w-full border-2 border-gray-300 shadow-sm text-blue-gray-900 sm:text-sm focus:ring-chairgreen-400 focus:border-chairgreen-400" 
                              defaultValue={project.streetNum}
                              onChange={onChange}
                      />
                    </div>

                    <div className="block">
                      <label htmlFor="StreetName" className="text-sm font-medium text-blue-gray-900">
                          Street Name
                      </label>
                      <input  type="text" 
                              name="streetName"
                              id="streetName"
                              placeholder="Street Name" 
                              className="form-input rounded-lg mt-1 p-2 block w-full border-2 border-gray-300 shadow-sm text-blue-gray-900 sm:text-sm focus:ring-chairgreen-400 focus:border-chairgreen-400"
                              defaultValue={project.streetName}
                              onChange={onChange}
                      />
                    </div>

                    <div className="block">
                      <label htmlFor="city" className="text-sm font-medium text-blue-gray-900">
                          City
                      </label>
                      <input  type="text" 
                              name="city" 
                              id="city"
                              placeholder="city" 
                              className="form-input rounded-lg mt-1 p-2 block w-full border-2 border-gray-300 shadow-sm text-blue-gray-900 sm:text-sm focus:ring-chairgreen-400 focus:border-chairgreen-400" 
                              defaultValue={project.city}
                              onChange={onChange}
                      />
                    </div>

                    <div className="block">
                      <label htmlFor="postalCode" className="text-sm font-medium text-blue-gray-900">
                          Postal Code
                      </label>
                      <input  type="text" 
                              name="postalCode"
                              id="postalCode"
                              placeholder="Postal Code"
                              className="form-input rounded-lg mt-1 p-2 block w-full border-2 border-gray-300 shadow-sm text-blue-gray-900 sm:text-sm focus:ring-chairgreen-400 focus:border-chairgreen-400" 
                              defaultValue={project.postalCode}
                              onChange={onChange}
                      />
                    </div>

                    <div className="block sm:col-span-2">
                      <label labelFor="description" className="text-sm font-medium text-gray-900">
                          Description
                      <textarea   name="description"
                                  id="description"
                                  rows={4}
                                  className="form-textarea rounded-lg mt-1 p-2 block w-full border-2 border-gray-300 shadow-sm text-blue-gray-900 sm:text-sm focus:ring-chairgreen-400 focus:border-chairgreen-400" 
                                  placeholder="Describe the project in few words."
                                  defaultValue={project.description}
                                  onChange={onChange}
                      />
                      </label>
                    </div>

                    <div className="sm:col-span-2 mb:col-span-1">
                      <label htmlFor="projectImage" className="block text-sm font-medium text-gray-700">
                          Image URL
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                              https://
                          </span>
                          <input
                              type="text"
                              name="projectImage"
                              id="projectImage"
                              className="form-input focus:outline flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 focus:ring-chairgreen-400 focus:border-chairgreen-400"
                              placeholder="www.example.com/images/img001.jpg" 
                              defaultValue={project.projectImage}
                              onChange={onChange}/>
                      </div>
                    </div>  

                    <div className="sm:col-span-2 mb:col-span-1 pb-6">
                        <label htmlFor="projectLink" className="block text-sm font-medium text-gray-700">
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
                                onChange={onChange}/>
                        </div>
                    </div>

                  </div>
                  <div className="flex col-start-2 items-center justify-end p-4 rounded-b border-t border-solid border-blueGray-200">
                      <button
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                        type="button"
                        onClick={() => setShowModal(false)}>
                        Close
                      </button>
                      <button className="px-4 py-2 font-semibold text-sm bg-chairgreen-500 text-white rounded-md shadow-sm hover:-translate-y-1 hover:scale-110 hover:bg-chairgreen-700 ease-in-out delay-150 duration-300"
                              type="submit">
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
        <div className="min-h-full py-10 bg-gray-100">
          <h2 className="block text-gray-600 mx-auto sm:px-6 lg:px-8 sm:rounded-[24px] pb-4 font-bold text-3xl text-blue-gray-900">
            MY LISTINGS
          </h2>
          <div className="max-w-7xl sm:px-6 lg:px-8 mb:rounded-[24px] mx-auto bg-white container">
            <div className="pt-8 text-center">
              <Link to={"/newlisting"}>
                <button className="text-center rounded-lg p-4 bg-chairgreen-500 hover:bg-chairgreen-600 text-white font-bold text-lg">
                  New Listing
                </button>
              </Link>
            </div>
            <div className="py-4 grid grid-cols-3 grid-flow-cols gap-9 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 sm:gap-x-6 mb:grid-cols-1">
              {listings?.map((listing) => (
                <>
                  <div className="pb-4 shadow-2xl group container  transform transition-all hover:-translate-y-2 duration-300 rounded-md bg-white max-w-xs flex justify-center rounded-t-lg  mx-auto content-div">
                    <div className=" flex-wrap flex">
                      <div className="absolute p-2 m-4 w-16 h-16 text-center bg-gray-700 rounded-full text-white right-0 fd-cl group-hover:opacity-25">
                        <span className="text-base tracking-wide  font-bold border-b border-white font-sans">
                          12
                        </span>
                        <span className="text-xs tracking-wide font-bold uppercase block font-sans">
                          April
                        </span>
                      </div>
                      <div className="mx-auto object-cover w-full rounded-t-md">
                        <img
                          className="rounded-t min-w-full"
                          src={listing.projectImage}
                          alt=""
                        />
                      </div>
                      <div className="py-8 px-4 bg-white w-full rounded-b-md fd-cl group-hover:opacity-25">
                        <span className="block text-lg text-gray-800 font-bold tracking-wide">
                          {listing.projectName}
                        </span>
                        <span className="block text-gray-600 text-sm">
                          {listing.projectDescription}.<br />
                          <Link
                            className="text-chairgreen-400"
                            to={`/listings/${listing.projectId}`}
                          >
                            Read more
                          </Link>
                        </span>
                      </div>
                    </div>
                    <div className="absolute opacity-0 fd-sh hover:opacity-100">
                      <div className="pt-8 text-center">
                        <button className="bg-blue-200 text-black active:bg-chairgreen-400 text-center text-lg
                                            font-bold px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                                type="button"
                                onClick={() => setShowModal(true)}
                        >
                          Edit
                        </button>
                      </div>
                      <div className="pt-8 text-center">
                        <button className="bg-blue-200 text-red-500 active:bg-chairgreen-400 text-center text-lg
                                            font-bold px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                                            type="button"
                                            onClick={() => deleteListing(project.projectDetail.projectID)}>
                          Delete
                        </button>
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
    );
}
