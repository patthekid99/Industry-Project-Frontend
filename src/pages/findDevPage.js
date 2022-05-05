import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronLeftIcon } from "@heroicons/react/solid";
import { RadioGroup } from "@headlessui/react";

const devKeys = {
  developerName: "Developer Name",
  phoneNumber: "Phone Number",
  email: "Email",
  website: "Website",
  avgStarRating: "Average Star Rating",
};

const memoryOptions = [
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
  const [state, setState] = useState({
    showContacts: true,
    realtors: [],
    realtorSelected: {},
    showReviews: false,
    reviews: [],
    comment: "",
    starRating: 5,
  });

  useEffect(() => {
    async function getDevelopers() {
      const results = await axios.get(
        "https://localhost:44340/api/directory/developers"
      );
      const result = results.data;
      setState({ ...state, developers: result, developersSelected: result[0] });
      console.log(result);
    }
    getDevelopers();
  }, []);

  const getReviews = async () => {
    var mydata = JSON.parse(localStorage.getItem("myData"));
    const results = await axios.get(
      `https://localhost:44340/api/review/developers/${state.developersSelected.developerId}`,
      {
        headers: {
          Authorization: `Bearer ${mydata.tokenString}`,
        },
      }
    );
    const result = results.data;
    console.log(result);
    setState({
      ...state,
      showReviews: true,
      reviews: result,
      comment: "",
      starRating: 5,
    });
  };

  const postReview = async () => {
    var mydata = JSON.parse(localStorage.getItem("myData"));
    const data = { comment: state.comment, starRating: state.starRating };
    const results = await axios.post(
      `https://localhost:44340/api/review/${state.developersSelected.developerId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${mydata.tokenString}`,
        },
      }
    );
    getReviews();
  };

  const onChange = (e) => {
    e.persist();
    setState({ ...state, [e.target.name]: e.target.value });
  };

  return (
    <div className="h-screen w-full flex antialiased bg-gray-100 overflow-hidden sm:p-10">
      <div className="flex-1 flex flex-col max-w-7xl mx-auto sm:rounded-[24px] bg-white">
        <main className="flex-grow flex flex-row min-h-0">
          <section
            className={`flex flex-col flex-none overflow-auto  lg:max-w-xs md:w-2/5 transition-all duration-300 ease-in-out  ${
              state.showContacts ? "w-full group" : "w-0 group"
            }`}
          >
            <div className="search-box p-4 flex-none">
              <form onSubmit="">
                <div className="relative">
                  <label>
                    <input
                      className="rounded-full py-2 pr-10 pl-10 w-full border border-gray-300 focus:border-gray-700 bg-white focus:bg-white focus:outline-none focus:shadow-md transition duration-300 ease-in"
                      type="text"
                      placeholder="Search Realtors"
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
            </div>
            <div className="contacts p-2 flex-1 overflow-y-scroll">
              {state.realtors.map((r) => (
                <div
                  className="flex justify-between items-center p-3 hover:bg-gray-200 rounded-lg relative"
                  onClick={() =>
                    setState({
                      ...state,
                      realtorSelected: r,
                      showContacts: false,
                      showReviews: false,
                    })
                  }
                >
                  <div className="w-16 h-16 relative flex flex-shrink-0">
                    <img
                      className="shadow-md rounded-full w-full h-full object-cover"
                      src={r.logo}
                      alt=""
                    />
                  </div>
                  <div className="flex-auto min-w-0 ml-4 mr-6 md:block group-hover:block">
                    <p>{r.firstName + " " + r.lastName}</p>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="min-w-0">
                        <p className="truncate">{r.avgStarRating}</p>
                      </div>
                    </div>
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
            <article>
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
                        src={state.realtorSelected.profilePic}
                        alt=""
                      />
                    </div>
                    <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                      <div className="sm:hidden 2xl:block mt-6 min-w-0 flex-1">
                        <h1 className="text-2xl font-bold truncate">
                          {state.realtorSelected.firstName +
                            " " +
                            state.realtorSelected.lastName}
                        </h1>
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:block 2xl:hidden mt-6 min-w-0 flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 truncate">
                      {state.realtorSelected.firstName +
                        " " +
                        state.realtorSelected.lastName}
                    </h1>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="mt-6 sm:mt-2 2xl:mt-5">
                <div className="border-b border-grey-200">
                  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
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
                        onClick={() => getReviews()}
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
                    <div>
                      <ul role="list" className="space-y-8">
                        {state.reviews.map((review) => (
                          <li key={review.reviewId}>
                            <div className="flex space-x-3">
                              <div className="flex-shrink-0">
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={review.potentialBuyer.profilePic}
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
                                  <p>{review.comment}</p>
                                </div>
                                <div className="mt-2 text-sm space-x-2">
                                  <span className="text-gray-500 font-medium">
                                    {review.starRating + " STARS"}
                                  </span>{" "}
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-gray-50 py-6">
                      <div className="flex space-x-3">
                        <div className="flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full"
                            src="https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80"
                            alt=""
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <form action="#">
                            <div>
                              <label htmlFor="comment" className="sr-only">
                                About
                              </label>
                              <textarea
                                id="comment"
                                name="comment"
                                rows={3}
                                className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
                                placeholder="Post a review..."
                                defaultValue={""}
                              />
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                              <a
                                href="#"
                                className="group inline-flex items-start text-sm space-x-2 text-gray-900 hover:text-gray-900"
                              ></a>
                              <button
                                type="submit"
                                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Post Review
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                    {Object.keys(devKeys).map((field) => (
                      <div key={field} className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          {devKeys[field]}
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {state.realtorSelected[field]}
                        </dd>
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">
                        About
                      </dt>
                      <dd
                        className="mt-1 max-w-prose text-sm text-gray-900 space-y-5"
                        dangerouslySetInnerHTML={{
                          __html: state.realtorSelected.bioText,
                        }}
                      />
                    </div>
                  </dl>
                )}
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}
