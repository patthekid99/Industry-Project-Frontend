import logo from '../images/logo.jpg';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <>
      <div className="min-h-screen bg-chairgreen-500">
        <div className=" py-0 sm:py-10">
            <div className="max-w-7xl mx-auto sm:px-0 md:px-8">
              <div className='container mx-auto'>
                <div className="relative bg-white overflow-hidden sm:rounded-[24px]  ">
                  <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                      <svg
                        className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
                        fill="currentColor"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        <polygon points="50,0 100,0 50,100 0,100" />
                      </svg>
                      <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                        <div className="sm:text-center lg:text-left">
                          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                            <span className="block xl:inline">Project P3</span>{' '}
                            <span className="block text-chairgreen-600 m:inline">For People, Property and Prosperity</span>
                          </h1>
                          <p className="mt-3 text-base text-chairgreen-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                            We provide an opportunity for property developers to get additional display of their projects, buyers to review and rate 
                            developers in addition to being aware of a wider option of presale property and realtors to have greater exposure to potential 
                            clients, all in one space.
                          </p>
                          <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                            <div className="rounded-md shadow">
                              <button
                                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-chairgreen-600 hover:bg-chairgreen-700 md:py-4 md:text-lg md:px-10"
                              >
                                <Link to={"/register"}>Get started</Link> 
                              </button>
                            </div>
                            <div className="mt-3 sm:mt-0 sm:ml-3">
                              <button
                                className='w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gold-600 hover:bg-gold-700 md:py-4 md:text-lg md:px-10'
                              >
                                <Link to={"/home"}>Browse listings</Link> 
                              </button>
                            </div>
                          </div>
                        </div>
                      </main>
                    </div>
                  </div>
                  <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                    <img
                      className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
                      src={logo}
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </>
  )
}