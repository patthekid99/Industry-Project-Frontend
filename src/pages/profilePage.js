import { useState, useEffect } from "react";
import axios from "axios";

export default function ProfilePage() {
  const [profile, setProfile] = useState({ userDetails: {}, role: "" });

  useEffect(() => {
    async function getUserProfile() {
      var mydata = JSON.parse(localStorage.getItem("myData"));
      const result = await axios.get("https://localhost:44340/api/Profile", {
        headers: {
          Authorization: `Bearer ${mydata.tokenString}`,
        },
      });
      const resultProfile = result.data;
      setProfile(resultProfile);
      console.log(resultProfile);
    }
    getUserProfile();
  }, []);

  const updateProfile = async (e) => {
    e.preventDefault();
    var mydata = JSON.parse(localStorage.getItem("myData"));
    const result = await axios.put(
      `https://localhost:44342/api/Profile/${profile.role}`,
      profile.userDetails,
      {
        headers: {
          Authorization: `Bearer ${mydata.tokenString}`,
        },
      }
    );
    const resultProfile = result.data;
    setProfile(resultProfile);
    console.log(resultProfile);
  };

  const onChange = (e) => {
    e.persist();
    setProfile({
      ...profile,
      userDetails: { ...profile.userDetails, [e.target.name]: e.target.value },
    });
  };

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
                          className="mt-1 p-2 block w-full border-2 border-gray-300 rounded-md shadow-sm text-blue-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
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
                      </div>{" "}
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
                        <input
                          type="text"
                          name="website"
                          id="website"
                          className="mt-1 p-2 block w-full border-2 border-gray-300 rounded-md shadow-sm text-blue-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                          defaultValue={profile.userDetails.website}
                          onChange={onChange}
                        />
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
                          className="mt-1 p-2 block w-full border-2 border-gray-300 rounded-md shadow-sm text-blue-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                          defaultValue={profile.userDetails.companyName}
                          onChange={onChange}
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="languages"
                          className="block text-sm font-medium text-blue-gray-900"
                        >
                          Languages
                        </label>
                        <input
                          type="text"
                          name="languages"
                          id="languages"
                          className="mt-1 p-2 block w-full border-2 border-gray-300 rounded-md shadow-sm text-blue-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                          defaultValue={profile.userDetails.languages}
                          onChange={onChange}
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
                        <input
                          type="text"
                          name="email"
                          id="email"
                          autoComplete="email"
                          className="mt-1 p-2 block w-full border-2 border-gray-300 rounded-md shadow-sm text-blue-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                          defaultValue={profile.userDetails.email}
                          onChange={onChange}
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="phoneNumber"
                          className="block text-sm font-medium text-blue-gray-900"
                        >
                          Phone number
                        </label>
                        <input
                          type="text"
                          name="phoneNumber"
                          id="phoneNumber"
                          autoComplete="tel"
                          className="mt-1 p-2 block w-full border-2 border-gray-300 rounded-md shadow-sm text-blue-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
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
                            src={profile.userDetails.logo}
                            alt=""
                          />
                          <div className="w-full ml-4 flex">
                            <input
                              type="text"
                              name="logo"
                              id="logo"
                              className="mt-1 p-2 block w-full border-2 border-gray-300 rounded-md shadow-sm text-blue-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                              defaultValue={profile.userDetails.logo}
                              onChange={onChange}
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
                            src={profile.userDetails.profilePic}
                            alt=""
                          />
                          <div className="w-full ml-4 flex">
                            <input
                              type="text"
                              name="profilePic"
                              id="profilePic"
                              className="mt-1 p-2 block w-full border-2 border-gray-300 rounded-md shadow-sm text-blue-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                              defaultValue={profile.userDetails.profilePic}
                              onChange={onChange}
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
                          className="block w-full border border-blue-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500"
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
                      <input
                        type="text"
                        name="email"
                        id="email"
                        autoComplete="email"
                        className="mt-1 p-2 block w-full border-2 border-gray-300 rounded-md shadow-sm text-blue-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                        defaultValue={profile.userDetails.email}
                        onChange={onChange}
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="phoneNumber"
                        className="block text-sm font-medium text-blue-gray-900"
                      >
                        Phone number
                      </label>
                      <input
                        type="text"
                        name="phoneNumber"
                        id="phoneNumber"
                        autoComplete="tel"
                        className="mt-1 p-2 block w-full border-2 border-gray-300 rounded-md shadow-sm text-blue-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
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
                      <input
                        type="text"
                        name="website"
                        id="website"
                        className="mt-1 p-2 block w-full border-2 border-gray-300 rounded-md shadow-sm text-blue-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                        defaultValue={profile.userDetails.website}
                        onChange={onChange}
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="linkedIn"
                        className="block text-sm font-medium text-blue-gray-900"
                      >
                        LinkedIn
                      </label>
                      <input
                        type="text"
                        name="linkedIn"
                        id="linkedIn"
                        className="mt-1 p-2 block w-full border-2 border-gray-300 rounded-md shadow-sm text-blue-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                        defaultValue={profile.userDetails.linkedIn}
                        onChange={onChange}
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="youtube"
                        className="block text-sm font-medium text-blue-gray-900"
                      >
                        Youtube
                      </label>
                      <input
                        type="text"
                        name="youtube"
                        id="youtube"
                        className="mt-1 p-2 block w-full border-2 border-gray-300 rounded-md shadow-sm text-blue-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                        defaultValue={profile.userDetails.youtube}
                        onChange={onChange}
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="twitter"
                        className="block text-sm font-medium text-blue-gray-900"
                      >
                        Twitter
                      </label>
                      <input
                        type="text"
                        name="twitter"
                        id="twitter"
                        className="mt-1 p-2 block w-full border-2 border-gray-300 rounded-md shadow-sm text-blue-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                        defaultValue={profile.userDetails.twitter}
                        onChange={onChange}
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="facebook"
                        className="block text-sm font-medium text-blue-gray-900"
                      >
                        Facebook
                      </label>
                      <input
                        type="text"
                        name="facebook"
                        id="facebook"
                        className="mt-1 p-2 block w-full border-2 border-gray-300 rounded-md shadow-sm text-blue-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                        defaultValue={profile.userDetails.facebook}
                        onChange={onChange}
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="instagram"
                        className="block text-sm font-medium text-blue-gray-900"
                      >
                        Instagram
                      </label>
                      <input
                        type="text"
                        name="instagram"
                        id="instagram"
                        className="mt-1 p-2 block w-full border-2 border-gray-300 rounded-md shadow-sm text-blue-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                        defaultValue={profile.userDetails.instagram}
                        onChange={onChange}
                      />
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
                    Cancel
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