import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronLeftIcon } from "@heroicons/react/solid";
import blankPic from "../images/defaultProfilePic.jpg";
import BounceLoader from "react-spinners/FadeLoader";
const baseURL = process.env.REACT_APP_GLOBAL_API + "api/";

const devKeys = [
  { name: "Email", value: "email", link: false },
  { name: "Phone", value: "phoneNumber", link: false },
  { name: "Website", value: "website", link: true },
  { name: "Average Rating", value: "avgStarRating", link: false },
];

const ratingOptions = [
  { name: "Excellent", value: 5 },
  { name: "Above Average", value: 4 },
  { name: "Average", value: 3 },
  { name: "Below Average", value: 2 },
  { name: "Poor", value: 1 },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function FindDeveloper() {
  const [showContacts, setShowContacts] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const [developers, setDevelopers] = useState([]);
  const [devSelected, setDevSelected] = useState({
    developer: {},
    reviews: [],
  });
  const [showReviews, setReviews] = useState(false);
  const [postReviewBody, setPostReview] = useState({
    comment: "",
    starRating: 5,
  });
  const [user, setUser] = useState({});

  useEffect(() => {
    setTimeout(() => {
      setShowLoader(false);
    }, 600);
    async function getDevelopers() {
      const results = await axios.get(baseURL + "directory/developers");
      const result = results.data;
      const defaultDev = await axios.get(
        baseURL + `directory/developers/${result[0].developerID}`
      );
      const dev = defaultDev.data;
      setDevelopers(result);
      setDevSelected(dev);
    }
    getDevelopers();
  }, []);

  async function updateSelectedDeveloper(id) {
    const result = await axios.get(baseURL + `directory/developers/${id}`);
    setDevSelected(result.data);
    setShowContacts(false);
  }

  async function deleteReview(id) {
    var mydata = JSON.parse(localStorage.getItem("myData"));
    const result = await axios.delete(baseURL + `review/developer/${id}`, {
      headers: {
        Authorization: `Bearer ${mydata.tokenString}`,
      },
    });
    updateSelectedDeveloper(result.data.developerId);
  }

  const getUserReviews = async () => {
    var mydata = JSON.parse(localStorage.getItem("myData"));
    if (mydata != null) {
      const result = await axios
        .get(baseURL + "Profile", {
          headers: {
            Authorization: `Bearer ${mydata.tokenString}`,
          },
        })
        .then(function (res) {
          setUser(res.data);
          setReviews(true);
          setPostReview({ comment: "", starRating: 5 });
        })
        .catch(function (error) {
          setUser({ userDetails: { email: "email" }, role: "" });
          setReviews(true);
          setPostReview({ comment: "", starRating: 5 });
        });
    } else {
      setUser({ userDetails: { email: "email" }, role: "" });
      setReviews(true);
      setPostReview({ comment: "", starRating: 5 });
    }
  };

  const postReview = async (e) => {
    e.preventDefault();
    var mydata = JSON.parse(localStorage.getItem("myData"));
    const data = {
      comment: postReviewBody.comment,
      starRating: postReviewBody.starRating,
    };
    const results = await axios.post(
      baseURL + `review/developer/${devSelected.developer.developerId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${mydata.tokenString}`,
        },
      }
    );
    updateSelectedDeveloper(devSelected.developer.developerId);
  };

  const searchDevelopers = async (e) => {
    var result;
    console.log(e.target.value);
    const trimed = e.target.value.split(" ").join("");
    if (!trimed) {
      result = await axios.get(baseURL + "directory/developers");
    } else {
      result = await axios.get(baseURL + `directory/developers/name/${trimed}`);
    }
    if (result.data.length > 0) {
      const updateSelected = await axios.get(
        baseURL + `directory/developers/${result.data[0].developerID}`
      );
      setDevelopers(result.data);
      setDevSelected(updateSelected.data);
    } else {
      setDevelopers(result.data);
    }
  };

  const sortByRating = async (e) => {
    var result;
    if (!e.target.value) {
      result = await axios.get(baseURL + "directory/developers");
    } else {
      result = await axios.get(baseURL + `developers/rating/${e.target.value}`);
    }
    const updateSelected = await axios.get(
      baseURL + `directory/developers/${result.data[0].developerID}`
    );
    setDevelopers(result.data);
    setDevSelected(updateSelected.data);
  };

  const onChange = (e) => {
    e.persist();
    setPostReview({ ...postReviewBody, [e.target.name]: e.target.value });
  };

  return (
    <>
      {showLoader ? (
        <div className="flex justify-center items-center h-screen">
          <BounceLoader color={"#2e5351"} loading={true} size={100} />
        </div>
      ) : (
        <div className="min-h-screen w-full flex antialiased bg-gray-100 overflow-hidden sm:p-10">
          <div className="flex-1 flex flex-col max-w-7xl mx-auto sm:rounded-[24px] bg-white ">
            <main className="flex-grow flex flex-row min-h-0">
              <section
                className={`flex flex-col flex-none overflow-auto transition-all duration-300 ease-in-out lg:max-w-xs md:w-2/5 ${
                  showContacts ? "w-full group" : "w-0 group"
                }`}
              >
                <div className="search-box p-4 flex-none">
                  <div className="relative">
                    <label>
                      <input
                        className="rounded-full py-2 pr-10 pl-10 w-4/5 border border-gray-300 focus:border-gray-700 bg-white focus:bg-white focus:outline-none focus:shadow-md "
                        type="text"
                        placeholder="Search Realtors"
                        onChange={searchDevelopers}
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
                  <span className="relative z-0 inline-flex shadow-sm rounded-md mt-2">
                    <label htmlFor="sort-by" className="sr-only">
                      Sort by Review
                    </label>
                    <select
                      id="sort-by"
                      name="sort-by"
                      onChange={sortByRating}
                      className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-chairgreen-500 focus:border-chairgreen-500"
                    >
                      <option value={""}> Sort By </option>
                      <option value={"ascending"}>Rating, Asc</option>
                      <option value={"descending"}>Rating, Desc</option>
                    </select>
                  </span>
                </div>
                <div className="contacts p-2 flex-1 overflow-y-scroll h-fit md:max-h-screen">
                  {developers.map((d) => (
                    <div
                      className="flex justify-between items-center p-3 hover:bg-gray-200 rounded-lg relative"
                      onClick={() => updateSelectedDeveloper(d.developerID)}
                    >
                      <div className="w-16 h-16 relative flex flex-shrink-0">
                        <img
                          className="shadow-md rounded-full w-full h-full object-cover"
                          src={d.logo ? d.logo : blankPic}
                          alt=""
                        />
                      </div>
                      <div className="flex-auto min-w-0 ml-4 mr-6 md:block group-hover:block">
                        <p>{d.developerName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              <section className="flex flex-col flex-auto border-gray-800 overflow-y-scroll">
                <nav
                  className="flex items-start px-4 py-3 sm:px-6 lg:px-8 md:hidden"
                  aria-label="Breadcrumb"
                >
                  <button
                    href="#"
                    className="inline-flex items-center space-x-3 text-sm font-medium text-gray-900"
                    onClick={() => setShowContacts(true)}
                  >
                    <ChevronLeftIcon
                      className="-ml-2 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <span>Directory</span>
                  </button>
                </nav>
                <article
                  className={`md: block ${
                    showContacts ? "hidden md:block" : ""
                  }`}
                >
                  {/* Profile header */}
                  <div>
                    <div>
                      <img
                        className="h-32 w-full object-cover lg:h-24"
                        src="https://www.groovyprint.co.uk/images/D/back_image54d107d04c7dd.png"
                        alt=""
                      />
                    </div>
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
                        <div className="flex">
                          <img
                            className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
                            src={
                              devSelected.developer.logo
                                ? devSelected.developer.logo
                                : blankPic
                            }
                            alt=""
                          />
                        </div>
                        <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                          <div className="sm:hidden 2xl:block mt-6 min-w-0 flex-1">
                            <h1 className="text-2xl font-bold truncate">
                              {devSelected.developer.developerName}
                            </h1>
                          </div>
                        </div>
                      </div>
                      <div className="hidden sm:block 2xl:hidden mt-6 min-w-0 flex-1">
                        <h1 className="text-2xl font-bold text-gray-900 truncate">
                          {devSelected.developer.developerName}
                        </h1>
                      </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="mt-6 sm:mt-2 2xl:mt-5">
                    <div className="border-b border-grey-200">
                      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <nav
                          className="-mb-px flex space-x-8"
                          aria-label="Tabs"
                        >
                          <a
                            key="profile"
                            className={classNames(
                              showReviews === false
                                ? "border-chairgreen-500 text-gray-900"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                              "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                            )}
                            onClick={() => setReviews(false)}
                          >
                            Profile
                          </a>
                          <a
                            key="reviews"
                            className={classNames(
                              showReviews === true
                                ? "border-chairgreen-500 text-gray-900"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                              "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                            )}
                            onClick={() => getUserReviews()}
                          >
                            Reviews
                          </a>
                        </nav>
                      </div>
                    </div>
                  </div>

                  {/* Description list */}
                  <div className="mt-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {showReviews ? (
                      <>
                        <div className="min-h-full mx-auto grid grid-cols-1 sm:px-6">
                          <ul role="list" className="space-y-8">
                            {devSelected.reviews.map((review) => (
                              <li key={review.reviewID}>
                                <div className="flex space-x-3">
                                  <div className="flex-shrink-0">
                                    <img
                                      className="h-10 w-10 rounded-full"
                                      src={
                                        review.potentialBuyer.profilePic
                                          ? review.potentialBuyer.profilePic
                                          : blankPic
                                      }
                                      alt=""
                                    />
                                  </div>
                                  <div>
                                    <div className="text-sm">
                                      <a
                                        href="#"
                                        className="font-medium text-gray-900"
                                      >
                                        {review.potentialBuyer.firstName +
                                          " " +
                                          review.potentialBuyer.lastName}
                                      </a>
                                    </div>
                                    <div className="mt-1 text-sm text-gray-700">
                                      <p className="break-all">
                                        {review.comment}
                                      </p>
                                    </div>
                                    <div className="mt-2 text-sm space-x-2">
                                      <span className="text-gray-500 font-medium">
                                        {review.starRating + " STARS"}
                                      </span>
                                      {review.potentialBuyer.email ===
                                      user.userDetails.email ? (
                                        <span
                                          className="text-md px-2 py-1 rounded-md bg-red-500 text-indigo-50 font-medium cursor-pointer"
                                          onClick={() =>
                                            deleteReview(review.reviewID)
                                          }
                                        >
                                          Delete
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                        {user.role === "PPOwner" ? (
                          <div className="bg-gray-50 my-6 flex-none">
                            <div className="flex space-x-3">
                              <div className="min-w-0 flex-1">
                                <form onSubmit={(e) => postReview(e)}>
                                  <label className="text-base font-medium text-gray-900 mx-4">
                                    Post a Review
                                  </label>
                                  <p className="text-sm leading-5 text-gray-500 mx-4 mt-4">
                                    How would you rate your expiereince with
                                    this realtor?
                                  </p>
                                  <fieldset className="mt-4">
                                    <legend className="sr-only">
                                      Notification method
                                    </legend>
                                    <div className="flex  flex-wrap items-center mx-4">
                                      {ratingOptions.map((ratingMethod) => (
                                        <div
                                          key={ratingMethod.value}
                                          className="flex items-center p-2"
                                        >
                                          <input
                                            id={ratingMethod.value}
                                            name="notification-method"
                                            type="radio"
                                            defaultChecked={
                                              ratingMethod.value ==
                                              postReviewBody.starRating
                                            }
                                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                            onChange={() =>
                                              setPostReview({
                                                ...postReviewBody,
                                                starRating: ratingMethod.value,
                                              })
                                            }
                                          />
                                          <label
                                            htmlFor={ratingMethod.value}
                                            className="ml-3 block text-sm font-medium text-gray-700"
                                          >
                                            {ratingMethod.name}
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                  </fieldset>
                                  <div>
                                    <label
                                      htmlFor="comment"
                                      className="sr-only"
                                    >
                                      Comment
                                    </label>
                                    <textarea
                                      id="comment"
                                      name="comment"
                                      rows={3}
                                      className="shadow-sm block w-11/12 focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md mx-4 p-2"
                                      placeholder="Post a comment..."
                                      onChange={onChange}
                                    />
                                  </div>

                                  <div className="m-3 flex items-center justify-between">
                                    <a
                                      href="#"
                                      className="group inline-flex items-start text-sm space-x-2 text-gray-900 hover:text-gray-900"
                                    ></a>
                                    <button
                                      type="submit"
                                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-chairgreen-600 hover:bg-chairgreen-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-chairgreen-500"
                                    >
                                      Post Review
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </>
                    ) : (
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                        {devKeys.map((d) =>
                          devSelected.developer[d.value] ? (
                            <div key={d.value} className="sm:col-span-1">
                              <dt className="text-sm font-medium text-gray-500">
                                {d.name}
                              </dt>
                              {d.link ? (
                                <dd className="mt-1 text-sm text-grey-900">
                                  <a
                                    target={"_blank"}
                                    href={"https://"+devSelected.developer[d.value]}
                                    className="text-blue-500"
                                  >
                                    {devSelected.developer[d.value]}
                                  </a>
                                </dd>
                              ) : (
                                <dd className="mt-1 text-sm text-grey-900">
                                  {devSelected.developer[d.value]}
                                </dd>
                              )}
                            </div>
                          ) : null
                        )}
                      </dl>
                    )}
                  </div>
                </article>
              </section>
            </main>
          </div>
        </div>
      )}{" "}
    </>
  );
}
