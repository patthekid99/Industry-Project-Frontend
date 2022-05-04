import React, { useState, useEffect } from 'react';
import axios from 'axios';  
import logo from '../images/logo.jpg';
import { Link, useNavigate } from 'react-router-dom';


export default function RegisterPage() {

    const [user, setUser] = useState({ Email: '', Password: '', Role: ''})
    let navigate = useNavigate();
    const apiUrl = "https://localhost:44342/api/Auth/register";
    
    const Register = (e) => {    
        e.preventDefault();
        const data = { Email: user.Email, Password: user.Password, Role: user.Role };
        console.log(data)
        axios.post(apiUrl, data)
        .then((result) => {
            console.log(result.data);
            const serializedState = JSON.stringify(result.data)
            var a = localStorage.setItem('myData', serializedState)
            console.log("A:",a)
            if(result.data.statusCode === "Result is valid. New user has been created")
            {
              navigate('/login')
            }
            else
            {
              alert('Invalid User')
            }
        }) 
    }

    const onChange = (e) => {    
        e.persist();        
        setUser({...user, [e.target.name]: e.target.value});
        console.log(user)    
      }

    return (
      <>
        <div className="min-h-screen sm:bg-chairgreen-500">
          <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <img
                  className="mx-auto h-24 w-auto"
                  src={logo}
                  alt="Workflow"
                />
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Register for your free account</h2>
                  <p className="my-2 text-center font-medium text-chairgreen-600 hover:text-chairgreen-500">
                    <Link to={"/login"}>Or if you already have an account signin</Link> 
                  </p>
                <form className="space-y-6" onSubmit={Register}>
                  <div>
                    <label htmlFor="Email" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <div className="mt-1">
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
                  <div>
                    <label htmlFor="Password" className="block text-sm font-medium text-gray-700">
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
                    <label htmlFor="Role" className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <div className="mt-1">
                        <select
                            id="Role"
                            name="Role"
                            value={user.Role}
                            onChange={onChange}
                            className=" block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-chairgreen-500 focus:border-chairgreen-500 sm:text-sm"
                        >
                            <option value={"PPOwner"}>Potential Property Buyer</option>
                            <option value={"Realtor"}>Realtor</option>
                            <option value={"Developer"}>Developer</option>
                        </select>
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gold-600 hover:bg-gold-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500"
                    >
                      Create Account
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }