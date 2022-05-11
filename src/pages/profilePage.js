import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import blankPic from "../images/defaultProfilePic.jpg";
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";

const baseURL = process.env.REACT_APP_GLOBAL_API + "api/";
const SASTOKEN = process.env.REACT_APP_SAS_KEY;
const IMAGEBUCKETURL = process.env.REACT_APP_IMAGE_URL;
export default function ProfilePage() {
  const [profile, setProfile] = useState({ userDetails: {}, role: "" });
  const [languages, setLanguages] = useState([]);
  const [realtorLanguanges, setRealtorLanguages] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  let naviagte = useNavigate();

  useEffect(() => {
    async function getUserProfile() {
      var mydata = JSON.parse(localStorage.getItem("myData"));
      const result = await axios.get(baseURL + "Profile", {
        headers: {
          Authorization: `Bearer ${mydata.tokenString}`,
        },
      });
      const resultProfile = result.data;
      if (resultProfile.role === "Realtor") {
        const realtor = await axios.get(baseURL + "Profile/realtor", {
          headers: {
            Authorization: `Bearer ${mydata.tokenString}`,
          },
        });
        setRealtorLanguages(realtor.data.languages);
        const langKeys = realtor.data.languages.map((l) => l.languageId);
        resultProfile.userDetails.languageKeys = langKeys;
      }
      const languages = await axios.get(baseURL + "language");
      setProfile(resultProfile);
      setLanguages(languages.data);
    }
    getUserProfile();
  }, []);

  const onFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    var profileData;
    const picname = uuidv4();
    if (imageFile != null) {
      uploadFile(picname);
      if (profile.role == "Developer") {
        profileData = { ...profile.userDetails, logo: picname };
      } else {
        profileData = { ...profile.userDetails, profilePic: picname };
      }
    } else {
      profileData = { ...profile.userDetails };
    }

    var mydata = JSON.parse(localStorage.getItem("myData"));
    const result = await axios
      .put(baseURL + `Profile/${profile.role}`, profileData, {
        headers: {
          Authorization: `Bearer ${mydata.tokenString}`,
        },
      })
      .then((res) => {
        naviagte("/home");
      });
  };

  const languageOptions = languages.map((language) => ({
    label: language.languageName,
    value: language.languageId,
  }));

  const defaultLanguages = languageOptions.filter((lo) => {
    return realtorLanguanges.some((rl) => {
      return lo.value === rl.languageId;
    });
  });

  const onChange = (e) => {
    e.persist();
    setProfile({
      ...profile,
      userDetails: { ...profile.userDetails, [e.target.name]: e.target.value },
    });
  };
  const uploadFile = async (name) => {
    setProfile({
      ...profile,
      userDetails: { ...profile.userDetails, ProfilePic: name },
    });

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

  function onLangChnage(e) {
    const filteredLang = e.map((l) => l.value);
    setProfile({
      ...profile,
      userDetails: { ...profile.userDetails, languageKeys: filteredLang },
    });
  }

  return (
    <div className="min-h-screen py-10 bg-gray-100">
      <main>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 sm:rounded-[24px] bg-white">
          <div className="flex-1 xl:overflow-y-auto">
            <div className="max-w-4xl mx-auto py-2 px-2 sm:px-2 lg:py-12 lg:px-2">
              <h1 className="text-3xl font-extrabold text-blue-gray-900">
                Account
              </h1>
              <form
                className="mt-6 space-y-8 divide-y divide-y-blue-gray-200"
                onSubmit={updateProfile}
              >
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                  <div className="sm:col-span-6">
                    <h2 className="text-xl font-medium text-blue-gray-900">
                      Profile
                    </h2>
                    <p className="mt-1 text-sm text-blue-gray-500">
                      This information will be displayed publicly so be careful
                      what you share.
                    </p>
                  </div>
                  {profile.role !== "Developer" ? (
                    <>
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-blue-gray-900"
                        >
                          First name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          id="firstName"
                          autoComplete="given-name"
                          className="form-input mt-1 p-2 block w-full border-2 border-gray-300 rounded-md shadow-sm text-blue-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                          defaultValue={profile.userDetails.firstName}
                          onChange={onChange}
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-medium text-blue-gray-900"
                        >
                          Last name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          id="lastName"
                          autoComplete="family-name"
                          className="mt-1 p-2 block w-full border-2 border-gray-300 rounded-md shadow-sm text-blue-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                          defaultValue={profile.userDetails.lastName}
                          onChange={onChange}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="developerName"
                          className="block text-sm font-medium text-blue-gray-900"
                        >
                          Developer Name
                        </label>
                        <input
                          type="text"
                          name="developerName"
                          id="developerName"
                          autoComplete="given-name"
                          className="mt-1 p-2 block w-full border-2 border-gray-300 rounded-md shadow-sm text-blue-gray-900 sm:text-sm focus:ring-chairgreen-500 focus:border-blue-500"
                          defaultValue={profile.userDetails.developerName}
                          onChange={onChange}
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="website"
                          className="block text-sm font-medium text-blue-gray-900"
                        >
                          Website
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            https://
                          </span>
                          <input
                            type="url"
                            name="website"
                            id="website"
                            className="form-input p-2 block w-full border-2 border-gray-300 rounded-r-md shadow-sm text-blue-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                            defaultValue={profile.userDetails.website}
                            onChange={onChange}
                          />
                        </div>
                      </div>{" "}
                    </>
                  )}
                  {profile.role === "Realtor" ? (
                    <>
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="companyName"
                          className="block text-sm font-medium text-blue-gray-900"
                        >
                          Company
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          id="companyName"
                          className="form-input mt-1 p-2 block w-full border-2 border-gray-300 rounded-md shadow-sm text-blue-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                          defaultValue={profile.userDetails.companyName}
                          onChange={onChange}
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="realtorLanguages"
                          className="block text-sm font-medium text-blue-gray-900"
                        >
                          Languages
                        </label>
                        <Select
                          className="mt-1 block rounded-md shadow-sm text-blue-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                          options={languageOptions}
                          isMulti={true}
                          defaultValue={defaultLanguages}
                          onChange={(e) => onLangChnage(e)}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-blue-gray-900"
                        >
                          Email address
                        </label>
                        <div class="mt-1 flex rounded-md shadow-sm">
                          <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            <svg
                              class="w-4 h-4 fill-current"
                              viewBox="0 0 20 20"
                            >
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                            </svg>
                          </span>
                          <input
                            disabled
                            type="email"
                            name="email"
                            id="email"
                            autoComplete="email"
                            className="form-input p-2 block w-full border-2 border-gray-300 rounded-r-md shadow-sm text-blue-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                            defaultValue={profile.userDetails.email}
                            onChange={onChange}
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="phoneNumber"
                          className="block text-sm font-medium text-blue-gray-900"
                        >
                          Phone number
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          id="phoneNumber"
                          autoComplete="tel"
                          className="form-input mt-1 p-2 block w-full border-2 border-gray-300 rounded-md shadow-sm text-blue-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                          defaultValue={profile.userDetails.phoneNumber}
                          onChange={onChange}
                        />
                      </div>
                    </>
                  )}
                  <div className="sm:col-span-6">
                    {profile.role === "Developer" ? (
                      <>
                        <label
                          htmlFor="logo"
                          className="block text-sm font-medium text-blue-gray-900"
                        >
                          Photo
                        </label>
                        <div className="mt-1 flex items-center">
                          <img
                            className="inline-block h-12 w-12 rounded-full"
                            src={
                              profile.userDetails.logo
                                ? IMAGEBUCKETURL + profile.userDetails.logo
                                : blankPic
                            }
                            alt=""
                          />
                          <div className="w-full ml-4 flex">
                            <input
                              type="file"
                              name="logo"
                              id="logo"
                              className="mt-1 p-2 block w-full border-2 border-gray-300 rounded-md shadow-sm text-blue-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                              defaultValue={profile.userDetails.logo}
                              onChange={onFileChange}
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <label
                          htmlFor="profilePic"
                          className="block text-sm font-medium text-blue-gray-900"
                        >
                          Photo
                        </label>
                        <div className="mt-1 flex items-center">
                          <img
                            className="inline-block h-12 w-12 rounded-full"
                            src={
                              profile.userDetails.profilePic
                                ? IMAGEBUCKETURL +
                                  profile.userDetails.profilePic
                                : blankPic
                            }
                            alt=""
                          />
                          <div className="w-full ml-4 flex">
                            <input
                              type="file"
                              name="profilePic"
                              id="profilePic"
                              className="form-input mt-1 p-2 block w-full border-2 border-gray-300 rounded-md shadow-sm text-blue-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                              defaultValue={profile.userDetails.profilePic}
                              onChange={onFileChange}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  {profile.role === "Realtor" ? (
                    <div className="sm:col-span-6">
                      <label
                        htmlFor="bioText"
                        className="block text-sm font-medium text-blue-gray-900"
                      >
                        Description
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="bioText"
                          name="bioText"
                          rows={4}
                          className="form-textarea block w-full border border-blue-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                          defaultValue={profile.userDetails.bioText}
                          onChange={onChange}
                        />
                      </div>
                      <p className="mt-3 text-sm text-blue-gray-500">
                        Brief description for your profile. URLs are
                        hyperlinked.
                      </p>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                {profile.role === "Realtor" ? (
                  <div className="pt-8 grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                    <div className="sm:col-span-6">
                      <h2 className="text-xl font-medium text-blue-gray-900">
                        Contact Information
                      </h2>
                      <p className="mt-1 text-sm text-blue-gray-500">
                        This information will be displayed publicly so be
                        careful what you share.
                      </p>
                    </div>
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-blue-gray-900"
                      >
                        Email address
                      </label>
                      <div class="mt-1 flex rounded-md shadow-sm">
                        <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                          <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                          </svg>
                        </span>
                        <input
                          disabled
                          type="email"
                          name="email"
                          id="email"
                          autoComplete="email"
                          className="form-input p-2 block w-full border-2 border-gray-300 rounded-r-md shadow-sm text-blue-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                          defaultValue={profile.userDetails.email}
                          onChange={onChange}
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="phoneNumber"
                        className="block text-sm font-medium text-blue-gray-900"
                      >
                        Phone number
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        id="phoneNumber"
                        autoComplete="tel"
                        className="form-input mt-1 p-2 block w-full border-2 border-gray-300 rounded-md shadow-sm text-blue-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                        defaultValue={profile.userDetails.phoneNumber}
                        onChange={onChange}
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="website"
                        className="block text-sm font-medium text-blue-gray-900"
                      >
                        Website
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                          https://
                        </span>
                        <input
                          type="url"
                          name="website"
                          id="website"
                          className="form-input p-2 block w-full border-2 border-gray-300 rounded-r-md shadow-sm text-blue-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                          defaultValue={profile.userDetails.website}
                          onChange={onChange}
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="linkedIn"
                        className="block text-sm font-medium text-blue-gray-900"
                      >
                        LinkedIn
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                          https://
                        </span>
                        <input
                          type="url"
                          name="linkedIn"
                          id="linkedIn"
                          className="form-input p-2 block w-full border-2 border-gray-300 rounded-r-md shadow-sm text-blue-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                          defaultValue={profile.userDetails.linkedIn}
                          onChange={onChange}
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="youtube"
                        className="block text-sm font-medium text-blue-gray-900"
                      >
                        Youtube
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                          https://
                        </span>
                        <input
                          type="url"
                          name="youtube"
                          id="youtube"
                          className="form-input p-2 block w-full border-2 border-gray-300 rounded-r-md shadow-sm text-blue-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                          defaultValue={profile.userDetails.youtube}
                          onChange={onChange}
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="twitter"
                        className="block text-sm font-medium text-blue-gray-900"
                      >
                        Twitter
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                          https://
                        </span>
                        <input
                          type="url"
                          name="twitter"
                          id="twitter"
                          className="form-input p-2 block w-full border-2 border-gray-300 rounded-r-md shadow-sm text-blue-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                          defaultValue={profile.userDetails.twitter}
                          onChange={onChange}
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="facebook"
                        className="block text-sm font-medium text-blue-gray-900"
                      >
                        Facebook
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                          https://
                        </span>
                        <input
                          type="url"
                          name="facebook"
                          id="facebook"
                          className="form-input p-2 block w-full border-2 border-gray-300 rounded-r-md shadow-sm text-blue-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                          defaultValue={profile.userDetails.facebook}
                          onChange={onChange}
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="instagram"
                        className="block text-sm font-medium text-blue-gray-900"
                      >
                        Instagram
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                          https://
                        </span>
                        <input
                          type="url"
                          name="instagram"
                          id="instagram"
                          className="form-input mt-1 p-2 block w-full border-2 border-gray-300 rounded-r-md shadow-sm text-blue-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                          defaultValue={profile.userDetails.instagram}
                          onChange={onChange}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <div className="pt-8 flex justify-end">
                  <button
                    type="button"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-blue-gray-900 hover:bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Link to={"/home"}>Cancel</Link>
                  </button>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-chairgreen-600 hover:bg-chairgreen-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-chairgreen-500"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
