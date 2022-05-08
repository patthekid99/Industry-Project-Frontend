import { useState, Fragment, useEffect } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import logo from "../images/logo.jpg";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import blankPic from "../images/defaultProfilePic.jpg"

const navigation = [
  { name: "HOME", link: "/home", current: true },
  { name: "FIND A REALTOR", link: "/realtordirectory", current: false },
  {name: "FIND A DEVELOPER", link: "/developerdirectory", current: false},
  { name: "MY LISTINGS", link: "/listings", current: false },
];

const userNavigation = [
  { name: "Your Profile", link: "/profile" },
  { name: "Sign out", link: "/login" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const [user, setUser] = useState([]);

  useEffect(() => {
    async function getUser() {
      var mydata = JSON.parse(localStorage.getItem("myData"));
      await axios
        .get("https://localhost:44340/api/Profile", {
          headers: {
            Authorization: `Bearer ${mydata.tokenString}`,
          },
        })
        .then(function (res) {
          setUser(res.data);
          console.log(res.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    getUser();
  }, []);

  const location = useLocation();

  return (
    <>
      <Disclosure as="nav" className="bg-white shadow-sm">
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <img
                      className="block lg:hidden h-8 w-auto"
                      src={logo}
                      alt="Workflow"
                    />
                    <img
                      className="hidden lg:block h-14 w-auto"
                      src={logo}
                      alt="Workflow"
                    />
                  </div>
                  <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                    {navigation.map((item) => (
                      <Link
                        className={classNames(
                          item.link === location.pathname
                            ? "border-chairgreen-500 text-gray-900"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                          "inline-flex items-center px-1 pt-1 border-b-4 text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                        to={item.link}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                  {user.length == 0 ? (
                    <div className="flex-shrink-0">
                      <button
                        type="button"
                        className="relative inline-flex items-center mr-4 px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-chairgreen-500 hover:bg-chairgreen-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-chairgreen-800 focus:ring-chairgreen-500"
                      >
                        <Link to={"/register"}>Sign up</Link>
                      </button>
                      <button
                        type="button"
                        className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gold-500 hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gold-800 focus:ring-gold-500"
                      >
                        <Link to={"/login"}>Login</Link>
                      </button>
                    </div>
                  ) : (
                    <Menu as="div" className="ml-3 relative">
                      <div>
                        <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          <span className="sr-only">Open user menu</span>
                          {user.role === "Developer" ? (
                            <img
                              className="h-8 w-8 rounded-full"
                              src={user.userDetails.logo ? user.userDetails.log : blankPic}
                              alt=""
                            />
                          ) : (
                            <img
                              className="h-8 w-8 rounded-full"
                              src={user.userDetails.profilePic ? user.userDetails.profilePic : blankPic}
                              alt=""
                            />
                          )}
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item key={"profile"}>
                            <Link
                              to={"/profile"}
                              className={classNames(
                                "/profile" === location.pathname
                                  ? "bg-gray-100"
                                  : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}>
                                Your Profile
                            </Link>
                          </Menu.Item>
                          <Menu.Item key={"signout"}>
                          <Link
                              to={"/login"}
                              onClick={() => localStorage.removeItem("myData")}
                              className={classNames(
                                "/login" === location.pathname
                                  ? "bg-gray-100"
                                  : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}>
                                Sign out
                            </Link>
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  )}
                </div>
                <div className="-mr-2 flex items-center sm:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="bg-white inline-flex items-center justify-center p-2 rounded-md text-chairgreen-500 hover:text-chairgreen-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-chairgreen-500">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <Link
                    className={classNames(
                      item.link === location.pathname
                        ? "bg-chairgreen-50 border-chairgreen-500 text-chairgreen-900"
                        : "border-transparent text-chairgreen-600 hover:bg-chairgreen-50 hover:border-chairgreen-300 hover:text-chairgreen-800",
                      "block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                    )}
                    aria-current={item.current ? "page" : undefined}
                    to={item.link}
                  >
                    <Disclosure.Button>{item.name}</Disclosure.Button>
                  </Link>
                ))}
              </div>
              <div className="pt-4 pb-3 border-t border-gray-200">
                {user.length == 0 ? (
                  <div className="flex-shrink-0">
                    <button
                      type="button"
                      className="relative inline-flex items-center mx-4 px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-chairgreen-500 hover:bg-chairgreen-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-chairgreen-800 focus:ring-chairgreen-500"
                    >
                      <Link to={"/register"}>Sign up</Link>
                    </button>
                    <button
                      type="button"
                      className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gold-500 hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gold-800 focus:ring-gold-500"
                    >
                      <Link to={"/login"}>Login</Link>
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center px-4">
                      <div className="flex-shrink-0">
                        {user.role === "Developer" ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={user.userDetails.logo}
                            alt=""
                          />
                        ) : (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={user.userDetails.profilePic}
                            alt=""
                          />
                        )}
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-medium text-gray-800">
                          {user.role === "Developer" ? (
                            <p>{user.userDetails.developerName}</p>
                          ) : (
                            <p>
                              {user.userDetails.firstName +
                                " " +
                                user.userDetails.lastName}
                            </p>
                          )}
                        </div>
                        <div className="text-sm font-medium text-gray-500">
                          {user.userDetails.email}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1">
                      <Link
                        className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                        to={"/profile"}
                      >
                         <Disclosure.Button>Your Profile</Disclosure.Button>
                      </Link>
                      <Link
                        className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                        to={"/login"}
                        onClick={() => localStorage.removeItem("myData")}
                      >
                        <Disclosure.Button>Sign out</Disclosure.Button>
                      </Link>
                      

                    </div>
                  </>
                )}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
}
