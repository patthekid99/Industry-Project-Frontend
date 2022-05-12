import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronLeftIcon, TrashIcon } from "@heroicons/react/solid";
import blankPic from "../images/defaultProfilePic.jpg";
import BounceLoader from "react-spinners/FadeLoader";
import FeatherIcon from "feather-icons-react";

const baseURL = process.env.REACT_APP_GLOBAL_API + "api/";

const IMAGEBUCKETURL = process.env.REACT_APP_IMAGE_URL;

const realtorKeys = [
  { name: "Email", value: "email", link: false, icon: "mail" },
  { name: "Company Name", value: "companyName", link: false, icon: "tablet" },
  { name: "Phone", value: "phoneNumber", link: false, icon: "phone" },
  { name: "Average Rating", value: "avgStarRating", link: false, icon: "hash" },
  { name: "Website", value: "website", link: true, icon: "airplay" },
  { name: "LinkedIn", value: "linkedIn", link: true, icon: "linkedin" },
  { name: "Twitter", value: "twitter", link: true, icon: "twitter" },
  { name: "Youtube", value: "youtube", link: true, icon: "youtube" },
  { name: "Instagram", value: "instagram", link: true, icon: "instagram" },
  { name: "Facebook", value: "facebook", link: true, icon: "facebook" },
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

export default function FindRealtor() {
  const [state, setState] = useState({
    showContacts: true,
    realtors: [],
    realtorSelected: { realtor: {}, languages: [], reviews: [] },
    showReviews: false,
    reviews: [],
    comment: "",
    starRating: 5,
    languages: [],
    companies: [],
    user: [{ userDetails: { email: "email" }, role: "" }],
  });
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowLoader(false);
    }, 600);
    async function getRealtors() {
      const results = await axios.get(baseURL + "directory/realtors");
      const result = results.data;
      const defaultRealtor = await axios.get(
        baseURL + `directory/realtors/${result[0].realtorID}`
      );
      const realtor = defaultRealtor.data;
      const languages = await axios.get(baseURL + "language");
      const language = languages.data;
      const companies = [
        ...new Set(result.map((realtor) => realtor.companyName)),
      ];
      setState({
        ...state,
        realtors: result,
        realtorSelected: realtor,
        languages: language,
        companies: companies,
      });
    }
    getRealtors();
  }, []);

  async function updateSelectedRealtor(id) {
    const result = await axios.get(baseURL + `directory/realtors/${id}`);
    setState({ ...state, realtorSelected: result.data, showContacts: false });
    console.log(result.data);
    console.log(id);
  }

  async function deleteReview(id) {
    var mydata = JSON.parse(localStorage.getItem("myData"));
    const result = await axios.delete(baseURL + `review/realtor/${id}`, {
      headers: {
        Authorization: `Bearer ${mydata.tokenString}`,
      },
    });
    updateSelectedRealtor(result.data.realtorId);
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
          setState({
            ...state,
            user: res.data,
            showReviews: true,
            comment: "",
            starRating: 5,
          });
          console.log(res.data);
        })
        .catch(function (error) {
          setState({
            ...state,
            user: { userDetails: { email: "email" }, role: "" },
            showReviews: true,
            comment: "",
            starRating: 5,
          });
          console.log(error);
        });
    } else {
      setState({
        ...state,
        user: { userDetails: { email: "email" }, role: "" },
        showReviews: true,
        comment: "",
        starRating: 5,
      });
    }
  };

  const postReview = async (e) => {
    e.preventDefault();
    var mydata = JSON.parse(localStorage.getItem("myData"));
    const data = { comment: state.comment, starRating: state.starRating };
    const results = await axios.post(
      baseURL + `review/realtor/${state.realtorSelected.realtor.realtorId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${mydata.tokenString}`,
        },
      }
    );
    updateSelectedRealtor(state.realtorSelected.realtor.realtorId);
  };

  const searchRealtors = async (e) => {
    var result;
    console.log(e.target.value);
    const trimed = e.target.value.split(" ").join("");
    if (!trimed) {
      result = await axios.get(baseURL + "directory/realtors");
    } else {
      result = await axios.get(baseURL + `directory/realtors/name/${trimed}`);
    }
    if (result.data.length > 0) {
      const updateSelected = await axios.get(
        baseURL + `directory/realtors/${result.data[0].realtorID}`
      );
      setState({
        ...state,
        realtors: result.data,
        realtorSelected: updateSelected.data,
      });
    } else {
      setState({ ...state, realtors: result.data });
    }
  };

  const filterByLanguage = async (e) => {
    var result;
    console.log(e.target.value);
    if (!e.target.value) {
      result = await axios.get(baseURL + "directory/realtors");
    } else {
      result = await axios.get(
        baseURL + `directory/realtors/lang/${e.target.value}`
      );
    }
    if (result.data.length > 0) {
      const updateSelected = await axios.get(
        baseURL + `directory/realtors/${result.data[0].realtorID}`
      );
      setState({
        ...state,
        realtors: result.data,
        realtorSelected: updateSelected.data,
      });
    } else {
      setState({ ...state, realtors: result.data });
    }
  };

  const filterByCompany = async (e) => {
    var result;
    console.log(e.target.value);
    const trimed = e.target.value.split(" ").join("");
    console.log(trimed);
    if (!trimed) {
      result = await axios.get(baseURL + "directory/realtors");
    } else {
      result = await axios.get(
        baseURL + `directory/realtors/company/${trimed}`
      );
    }
    if (result.data.length > 0) {
      const updateSelected = await axios.get(
        baseURL + `directory/realtors/${result.data[0].realtorID}`
      );
      setState({
        ...state,
        realtors: result.data,
        realtorSelected: updateSelected.data,
      });
    } else {
      setState({ ...state, realtors: result.data });
    }
  };

  const sortByRating = async (e) => {
    var result;
    if (!e.target.value) {
      result = await axios.get(baseURL + "directory/realtors");
    } else {
      result = await axios.get(
        baseURL + `directory/realtors/rating/${e.target.value}`
      );
    }
    const updateSelected = await axios.get(
      baseURL + `directory/realtors/${result.data[0].realtorID}`
    );
    setState({
      ...state,
      realtors: result.data,
      realtorSelected: updateSelected.data,
    });
  };

  const onChange = (e) => {
    e.persist();
    setState({ ...state, [e.target.name]: e.target.value });
    console.log(state.starRating);
  };

  const formatNumber = (phNumber) => {
    var formatedNumber = phNumber.substring(0,3) + "-" + phNumber.substring(3,6) + "-" + phNumber.substring(6,phNumber.length)
    return formatedNumber
  };
  return (
    <>
      {showLoader ? (
        <div className="flex justify-center items-center h-screen">
          <BounceLoader color={"#2e5351"} loading={true} size={100} />
        </div>
      ) : (
        <div className="min-h-screen w-full flex antialiased bg-gray-100 overflow-hidden sm:p-10">
          <div className="flex-1 flex flex-col max-w-7xl mx-auto sm:rounded-[24px] bg-white">
            <main className="flex-grow flex flex-row min-h-0">
              <section
                className={`flex flex-col flex-none overflow-auto transition-all duration-300 ease-in-out lg:max-w-xs md:w-2/5  ${
                  state.showContacts ? "w-full group" : "w-0 group"
                }`}
              >
                <div className="search-box p-4 flex-none">
                  <form onsubmit="">
                    <div className="relative">
                      <label>
                        <input
                          className="rounded-full py-2 pr-10 pl-10 w-4/5 border border-gray-300 focus:border-gray-700 bg-white focus:bg-white focus:outline-none focus:shadow-md "
                          type="text"
                          placeholder="Search Realtors"
                          onChange={searchRealtors}
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
                  <span className="relative z-0 inline-flex shadow-sm rounded-md mt-2">
                    <label htmlFor="sort-by" className="sr-only">
                      Sort by Review
                    </label>
                    <select
                      id="sort-by"
                      name="sort-by"
                      onChange={sortByRating}
                      className="w-1/3 relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-chairgreen-500 focus:border-chairgreen-500"
                    >
                      <option value={""}> Sort By </option>
                      <option value={"ascending"}>Rating, Asc</option>
                      <option value={"descending"}>Rating, Desc</option>
                    </select>
                    <select
                      id="languages"
                      name="languages"
                      onChange={filterByLanguage}
                      className="-ml-px w-1/3 realtive inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-chairgreen-500 focus:border-chairgreen-500"
                    >
                      <option value={""}> Languages </option>
                      {state.languages.map((language) => (
                        <option value={language.languageId}>
                          {" "}
                          {language.languageName}{" "}
                        </option>
                      ))}
                    </select>
                    <select
                      id="company"
                      name="company"
                      onChange={filterByCompany}
                      className="-ml-px w-1/3 relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-chairgreen-500 focus:border-chairgreen-500"
                    >
                      <option value={""}> Company </option>
                      {state.companies.map((company) => (
                        <option>{company}</option>
                      ))}
                    </select>
                  </span>
                </div>
                <div className="contacts p-2 flex-1 overflow-y-scroll h-fit md:max-h-screen">
                  {state.realtors.map((r) => (
                    <div
                      className="flex justify-between items-center p-3 hover:bg-gray-200 rounded-lg relative"
                      onClick={() => updateSelectedRealtor(r.realtorID)}
                    >
                      <div className="w-16 h-16 relative flex flex-shrink-0">
                        <img
                          className="shadow-md rounded-full w-full h-full object-cover"
                          src={
                            r.profilePic
                              ? IMAGEBUCKETURL + r.profilePic
                              : blankPic
                          }
                          alt=""
                        />
                      </div>
                      <div className="flex-auto min-w-0 ml-4 mr-6 md:block group-hover:block">
                        <p>{r.firstName + " " + r.lastName}</p>
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
                    onClick={() => setState({ ...state, showContacts: true })}
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
                    state.showContacts ? "hidden md:block" : ""
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
                    <div className="md:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
                        <div className="flex">
                          <img
                            className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
                            src={
                              state.realtorSelected.realtor.profilePic
                                ? IMAGEBUCKETURL +
                                  state.realtorSelected.realtor.profilePic
                                : blankPic
                            }
                            alt=""
                          />
                        </div>
                        <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                          <div className="sm:hidden 2xl:block mt-6 min-w-0 flex-1">
                            <h1 className="text-2xl font-bold truncate">
                              {state.realtorSelected.realtor.firstName +
                                " " +
                                state.realtorSelected.realtor.lastName}
                            </h1>
                          </div>
                        </div>
                      </div>
                      <div className="hidden sm:block 2xl:hidden mt-6 min-w-0 flex-1">
                        <h1 className="text-2xl font-bold text-gray-900 truncate">
                          {state.realtorSelected.realtor.firstName +
                            " " +
                            state.realtorSelected.realtor.lastName}
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
                              state.showReviews === false
                                ? "border-chairgreen-500 text-gray-900"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                              "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                            )}
                            onClick={() =>
                              setState({ ...state, showReviews: false })
                            }
                          >
                            Profile
                          </a>
                          <a
                            key="reviews"
                            className={classNames(
                              state.showReviews === true
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
                    {state.showReviews ? (
                      <>
                        <div className="min-h-full mx-auto grid grid-cols-1 sm:px-6">
                          <ul role="list" className="space-y-6 ">
                            {state.realtorSelected.reviews.map((review) => (
                              <li key={review.reviewID}>
                                <div className="flex space-x-3">
                                  <div className="flex-shrink-0">
                                    <img
                                      className="h-10 w-10 rounded-full"
                                      src={
                                        review.potentialBuyer.profilePic
                                          ? IMAGEBUCKETURL +
                                            review.potentialBuyer.profilePic
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
                                    <div className="m-1 text-sm text-gray-700">
                                      <p className="break-all">
                                        {review.comment}
                                      </p>
                                    </div>
                                    <div className="mt-2 text-sm space-x-2">
                                      <span className="text-gray-500 font-medium">
                                        {review.starRating + " STARS"}
                                      </span>
                                      {review.potentialBuyer.email ===
                                      state.user.userDetails.email ? (
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
                        {state.user.role === "PPOwner" ? (
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
                                              state.starRating
                                            }
                                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                            onChange={() =>
                                              setState({
                                                ...state,
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
                        {realtorKeys.map((r) =>
                          state.realtorSelected.realtor[r.value] ? (
                            <div key={r.value} className="sm:col-span-1">
                              <dt className="text-sm font-medium text-gray-500">
                                <FeatherIcon icon={r.icon} color="#2e5351" />{" "}
                                {r.name}
                              </dt>
                              {r.link ? (
                                <dd className="mt-1 text-sm text-grey-900">
                                  <a
                                    target={"_blank"}
                                    href={
                                      state.realtorSelected.realtor[r.value]
                                    }
                                    className="text-blue-500"
                                  >
                                    {state.realtorSelected.realtor[r.value]}
                                  </a>
                                </dd>
                              ) : (
                                <dd className="mt-1 text-sm text-grey-900">
                                  {(r.name.includes("Phone")) ? 
                                  formatNumber(state.realtorSelected.realtor[r.value])
                                  : state.realtorSelected.realtor[r.value]}
                                </dd>
                              )}
                            </div>
                          ) : null
                        )}
                        {state.realtorSelected.languages.length > 0 ? (
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">
                              <FeatherIcon icon="globe" /> Languages
                            </dt>

                            {state.realtorSelected.languages.map((lang) => (
                              <dd className="mt-1 text-sm text-gray-900">
                                {lang.languageName}
                              </dd>
                            ))}
                          </div>
                        ) : null}
                        {state.realtorSelected.realtor.bioText ? (
                          <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500">
                              About
                            </dt>
                            <dd
                              className="mt-1 max-w-prose text-sm text-gray-900 space-y-5"
                              dangerouslySetInnerHTML={{
                                __html: state.realtorSelected.realtor.bioText,
                              }}
                            />
                          </div>
                        ) : null}
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
