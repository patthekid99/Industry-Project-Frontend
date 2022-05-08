import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function NewListingPage() {
    let navigate = useNavigate();
    const [project, setProject] = useState({
        projectDetail:
        {
            developerID:"",
            projectName:"",
            streetNum:"",
            streetName:"",
            city:"",
            postalCode:"",
            description:"",
            projectImage:"",
            projectLink:""
        }}
    );

    useEffect(() => {
        getDeveloper();
    },[])
    
    // get Developer here and add developerID to the object
    const getDeveloper = async() => {
        var mydata = JSON.parse(localStorage.getItem("myData"));
        const result = await axios.get("https://localhost:44340/api/Profile", {
            headers: {
                Authorization: `Bearer ${mydata.tokenString}`,
            },
        });
        const resultProfile = result.data;
        project.developerID = resultProfile.developerID;

        setProject({
            ...project,
            projectDetail: {...project.projectDetail, developerID: resultProfile?.developerID }
        });
    }

    const onChange = (e) => {
        e.persist();
        setProject({
            ...project,
            projectDetail: {...project.projectDetail, [e.target.name]:e.target.value }
        });
    };
    const addListing = async (e) => {
        e.preventDefault();
        //add listing here
        const projectData = project.projectDetail
        var mydata = JSON.parse(localStorage.getItem("myData"));
        const result = await axios.post("https://localhost:44340/api/listing", {
            headers: {
            Authorization: `Bearer ${mydata.tokenString}`,
            }, 
            data: {projectData},
        });
        // If result is successful then return message.
        alert('Your new listing has been added successfully.');
        navigate('/listings')
    }
    return (
        <div className="flex flex-col items-center min-h-full p-10 bg-gray-100">
            <h2 className="pb-4 font-medium text-center leading-tight text-5xl mt-0 mb-2 text-blue-gray-900">Create new Listing</h2>
            <div className="p-6 flex justify-center items-center max-w-lg shadow-lg">
                <form className="flex justify-center items-center" onSubmit={addListing}>
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 ">
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
                                className="form-input focus:outline focus:ring-chairgreen-500 focus:border-chairgreen-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                placeholder="www.example.com/images/img001.jpg" 
                                defaultValue={project.projectImage}
                                onChange={onChange}/>
                        </div>
                    </div>

                    <div className="sm:col-span-2 mb:col-span-1">
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

                    <button className="bg-chairgreen-500 sm:col-span-2 justify-center text-white font-bold py-2 px-4 rounded-full shadow-sm hover:-translate-y-1 hover:scale-110 hover:bg-chairgreen-700 ease-in-out delay-150 duration-300" 
                            type="submit">
                                Submit
                    </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

// Columns
// "streetNum": "string",
//   "streetName": "string",
//   "city": "string",
//   "postalCode": "string",
//   "projectStatus": "string",
//   "projectImage": "string",
//   "projectName": "string",
//   "projectLink": "string",
//   "projectDescription": "string",
//   "created": "2022-05-05T19:54:01.328Z",
//   "expectedCompletion": "2022-05-06"