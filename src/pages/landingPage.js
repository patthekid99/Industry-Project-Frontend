import logo from "../images/logo.jpg";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

// screens: {
//   mb: "375px",
//   sm: "640px",
//   md: "768px",
//   lg: "1024px",
//   xl: "1280px",
// }

export default function LandingPage() {
  const [user, setUser] = useState({
    Email: "",
    Password: "",
    Role: "PPOwner",
  });
  let navigate = useNavigate();
  const apiUrl = "https://localhost:44340/api/Auth/register";

  const Register = (e) => {
    e.preventDefault();
    const data = {
      Email: user.Email,
      Password: user.Password,
      Role: user.Role,
    };
    console.log(data);
    axios.post(apiUrl, data).then((result) => {
      console.log(result.data);
      const serializedState = JSON.stringify(result.data);
      var a = localStorage.setItem("myData", serializedState);
      console.log("A:", a);
      if (
        result.data.statusCode === "Result is valid. New user has been created"
      ) {
        navigate("/login");
      } else {
        alert("Invalid User");
      }
    });
  };

  const onChange = (e) => {
    e.persist();
    setUser({ ...user, [e.target.name]: e.target.value });
    console.log(user);
  };

  return (
    <>
      <div className="min-h-screen bg-chairgreen-500">
        <div className=" py-0 sm:py-10">
          <div className="max-w-7xl mx-auto sm:px-0 sm:my-[10vh] md:px-8 md:my-[10vh]">
            <div className="container mx-auto">
              <div className="relative bg-white overflow-hidden sm:rounded-[24px]  ">
                <div className="max-w-7xl mx-auto">
                  <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-1/2 lg:pb-28 xl:pb-32">
                    <main className="mt-10 mx-auto max-w-1/2 px-4 sm:mt-12 hidden sm:px-6 hidden md:mt-16 hidden lg:mt-20 lg:block lg:px-8 xl:mt-28">
                      <div className="sm:text-center lg:text-left ">
                        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                          <span className="block xl:inline">Project P3</span>{" "}
                          <span className="block text-chairgreen-600 m:inline">
                            For People, Property and Prosperity
                          </span>
                        </h1>
                        <p className="mt-3 text-base text-chairgreen-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                          We provide an opportunity for property developers to
                          get additional display of their projects, buyers to
                          review and rate developers in addition to being aware
                          of a wider option of presale property and realtors to
                          have greater exposure to potential clients, all in one
                          space.
                        </p>
                        <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                          <div className="rounded-md shadow"></div>
                          <div className="mt-3 sm:mt-0 sm:ml-3">
                            <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gold-600 hover:bg-gold-700 md:py-4 md:text-lg md:px-10">
                              <Link to={"/home"}>Browse listings</Link>
                            </button>
                          </div>
                        </div>
                      </div>
                    </main>
                  </div>
                </div>
                <form
                  className="mb:h-screen sm:my-[5vh] md:my-[7vh] px-[8vw] lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 lg:my-[15vh] xl:my-[15vh]"
                  onSubmit={Register}
                >
                  <div>
                    <label className="block text-3xl text-chairgreen-500 text-center pb-[8vh] pt-0">
                      Create a new Account
                    </label>
                    <label
                      htmlFor="Email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email address
                    </label>
                    <div className="mt-1 my-[5vh]">
                      <input
                        id="Email"
                        name="Email"
                        type="email"
                        autoComplete="email"
                        value={user.Email}
                        onChange={onChange}
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-chairgreen-500 focus:border-chairgreen-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="my-[5vh]">
                    <label
                      htmlFor="Password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="Password"
                        name="Password"
                        type="password"
                        autoComplete="current-password"
                        value={user.Password}
                        onChange={onChange}
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-chairgreen-500 focus:border-chairgreen-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="Role"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Role
                    </label>
                    <div className="mt-1">
                      <select
                        id="Role"
                        name="Role"
                        value={user.Role}
                        onChange={onChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-chairgreen-500 focus:border-chairgreen-500 sm:text-sm"
                      >
                        <option value={"PPOwner"}>
                          Potential Property Buyer
                        </option>
                        <option value={"Realtor"}>Realtor</option>
                        <option value={"Developer"}>Developer</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="my-[5vh] w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gold-600 hover:bg-gold-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500"
                    >
                      Create Account
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
