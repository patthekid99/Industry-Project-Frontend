import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";
import FeatherIcon from "feather-icons-react";

const SASTOKEN = process.env.REACT_APP_SAS_KEY;
const IMAGEBUCKETURL = process.env.REACT_APP_IMAGE_URL;
export default function NewListingPage() {
  let navigate = useNavigate();
  const [project, setProject] = useState();
  const [token, setToken] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    getDeveloper();
  }, []);

  // get Developer here and add developerID to the object
  const getDeveloper = async () => {
    var mydata = JSON.parse(localStorage.getItem("myData"));
    setToken(mydata.tokenString);
    const result = await axios.get(
      `${process.env.REACT_APP_GLOBAL_API}api/Profile`,
      {
        headers: {
          Authorization: `Bearer ${mydata.tokenString}`,
        },
      }
    );
    setProject({ developerId: result.data.userDetails.developerId });
  };

  const onFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const onChange = (e) => {
    e.persist();
    setProject({
      ...project,
      [e.target.name]: e.target.value,
    });
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

  const addListing = async (e) => {
    e.preventDefault();
    var projectData;
    if (imageFile != null) {
      const picname = uuidv4();
      uploadFile(picname);
      projectData = { ...project, projectImage: picname };
    } else {
      projectData = { ...project };
    }

    const result = await axios.post(
      `${process.env.REACT_APP_GLOBAL_API}api/Listing`,
      projectData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    alert("Your new listing has been added successfully.");
    navigate("/listings");
  };
  return (
    <div className="flex flex-col items-center min-h-full p-10 bg-gray-100">
      <h2 className="pb-4 font-medium text-center leading-tight text-5xl mt-0 mb-2 text-blue-gray-900">
        Create new Listing
      </h2>
      <div className="p-6 flex justify-center items-center max-w-lg shadow-lg">
        <form
          className="flex justify-center items-center"
          onSubmit={addListing}
        >
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 ">
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
                type="number"
                name="streetNum"
                id="streetNum"
                inputmode="numeric" 
                pattern="\d*"
                placeholder="Street Number"
                className="form-input rounded-lg mt-1 p-2 block w-full border-2 border-gray-300 shadow-sm text-blue-gray-900 sm:text-sm focus:ring-chairgreen-400 focus:border-chairgreen-400"
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
                  className="form-input focus:outline focus:ring-chairgreen-500 focus:border-chairgreen-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                  placeholder="www.example.com/images/img001.jpg"
                  onChange={onFileChange}
                />
              </div>
            </div>

            <div className="sm:col-span-2 mb:col-span-1">
              <label
                htmlFor="projectLink"
                className="block text-sm font-medium text-gray-700"
              >
                Website URL
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  <FeatherIcon icon="airplay" color="#2e5351" />
                </span>
                <input
                  type="url"
                  name="projectLink"
                  id="projectLink"
                  pattern="http(s?)(:\/\/)((www.)?)(([^.]+)\.)?([a-zA-z0-9\-_]+)(\.)([a-zA-z0-9\-_]+)(\/[^\s]*)?"
                  title="The URL must follow a proper format: https://www.example.com"
                  placeholder="https://www.example.com"
                  className="form-input focus:outline focus:ring-chairgreen-500 focus:border-chairgreen-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                  onChange={onChange}
                />
              </div>
            </div>

            <button
              className="bg-chairgreen-500 sm:col-span-2 justify-center text-white font-bold py-2 px-4 rounded-full shadow-sm hover:-translate-y-1 hover:scale-110 hover:bg-chairgreen-700 ease-in-out delay-150 duration-300"
              type="submit"
            >
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
