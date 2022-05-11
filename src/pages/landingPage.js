import logo from "../images/logo.jpg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export default function LandingPage(formType) {
  const [user, setUser] = useState({
    Email: "",
    Password: "",
    Role: "PPOwner",
  });
  const [state, setState] = useState(true); //true if sign in displayed false if register
  let navigate = useNavigate();
  const baseURL = process.env.REACT_APP_GLOBAL_API + "api/auth/";

  const Register = (e) => {
    e.preventDefault();
    const data = {
      Email: user.Email,
      Password: user.Password,
      Role: user.Role,
    };
    console.log(data);
    axios.post(baseURL + "register", data).then((result) => {
      console.log(result.data);
      const serializedState = JSON.stringify(result.data);
      var a = localStorage.setItem("myData", serializedState);
      console.log("A:", a);
      if (
        result.data.statusCode === "Result is valid. New user has been created"
      ) {
        setState(true);
      } else {
        alert("Invalid User");
      }
    });
  };

  const Login = (e) => {
    e.preventDefault();
    const data = { Email: user.Email, Password: user.Password };
    axios.post(baseURL + "login", data).then((result) => {
      console.log(result.data);
      const serializedState = JSON.stringify(result.data);
      var a = localStorage.setItem("myData", serializedState);
      console.log("A:", a);
      if (result.data.statusCode === "OK") {
        navigate("/home");
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
      <section className="h-auto gradient-form bg-gray-200 md:h-screen sm:h-screen lg:h-screen">
        <div className="py-12 px-6 h-full">
          <div className="flex justify-center items-center flex-wrap h-full g-6 text-gray-800">
            <div className="xl:w-10/12">
              <div className="block bg-white shadow-lg rounded-lg">
                <div className="lg:flex lg:flex-wrap g-0">
                  <div className="lg:w-6/12 px-4 md:px-0">
                    <div className="md:p-12 md:mx-6">
                      <div className="text-center">
                        <img
                          className="mx-auto w-48 h-48"
                          src={logo}
                          alt="logo"
                        />
                        <h4 className="text-3xl font-semibold">
                          {state
                            ? "Sign in to your account"
                            : "Register for your free account"}
                        </h4>
                        {state ? (
                          <form onSubmit={Login}>
                            <p
                              className="my-4 text-center font-medium text-chairgreen-600 hover:text-chairgreen-500"
                              onClick={() => setState(false)}
                            >
                              Or register for a free account
                            </p>
                            <div className="mb-4">
                              <input
                                type="email"
                                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                id="Email"
                                name="Email"
                                placeholder="Email"
                                autoComplete="email"
                                value={user.Email}
                                onChange={onChange}
                                required
                              />
                            </div>
                            <div className="mb-4">
                              <input
                                type="password"
                                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                id="Password"
                                name="Password"
                                placeholder="Password"
                                autoComplete="current-password"
                                value={user.Password}
                                onChange={onChange}
                                required
                              />
                            </div>
                            <div className="text-center pt-1 mb-12 pb-1">
                              <button
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-chairgreen-600 hover:bg-chairgreen-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-chairgreen-500"
                                type="submit"
                              >
                                Log in
                              </button>
                            </div>
                          </form>
                        ) : (
                          <form onSubmit={Register}>
                            <p
                              className="my-4 text-center font-medium text-chairgreen-600 hover:text-chairgreen-500"
                              onClick={() => setState(true)}
                            >
                              Or if you already have an account signin
                            </p>
                            <div className="mb-4">
                              <input
                                type="email"
                                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                id="Email"
                                name="Email"
                                placeholder="Email"
                                autoComplete="email"
                                value={user.Email}
                                onChange={onChange}
                                required
                              />
                            </div>
                            <div className="mb-4">
                              <input
                                type="password"
                                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                id="Password"
                                name="Password"
                                placeholder="Password"
                                autoComplete="current-password"
                                value={user.Password}
                                onChange={onChange}
                                required
                              />
                            </div>
                            <div className="mb-4">
                              <select
                                id="Role"
                                name="Role"
                                value={user.Role}
                                onChange={onChange}
                                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                placeholder="Select your Role"
                              >
                                <option value={"PPOwner"}>
                                  Potential Property Buyer
                                </option>
                                <option value={"Realtor"}>Realtor</option>
                                <option value={"Developer"}>Developer</option>
                              </select>
                            </div>
                            <div className="text-center pt-1 mb-12 pb-1">
                              <button
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-chairgreen-600 hover:bg-chairgreen-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-chairgreen-500"
                                type="submit"
                              >
                                Create Account
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="lg:w-6/12 flex items-center lg:rounded-r-lg rounded-b-lg lg:rounded-bl-none bg-chairgreen-500">
                    <div className="text-white px-4 py-6 md:p-12 md:mx-6">
                      <h1 className="text-2xl font-extrabold sm:text-3xl md:text-4xl mb-6">
                        Welcome to What's on Presale?
                      </h1>
                      <h1 className="text-xl font-semibold mb-6">
                        For People, Property and Prosperity
                      </h1>
                      <p className="text-md mb-6">
                        We provide an opportunity for property developers to get
                        additional display of their projects, buyers to review
                        and rate developers in addition to being aware of a
                        wider option of presale property and realtors to have
                        greater exposure to potential clients, all in one space.
                      </p>
                      <Link to={"/home"}>
                        <button className="w-1/2 flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gold-600 hover:bg-gold-700 md:py-4 md:text-lg md:px-10">
                          Browse listings
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
