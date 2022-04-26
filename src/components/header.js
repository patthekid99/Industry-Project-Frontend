import { Disclosure, Menu } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import logo from '../images/logo.jpg';
import { Link } from 'react-router-dom';

const user = {
    name: 'Tom Cook',
    email: 'tom@example.com',
    imageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}
  const navigation = [
    { name: 'Home', link: '/home', current: false },
    { name: 'Find a Realtor', link: '/directory', current: false },
    { name: 'My Listings', link: '/listings', current: false },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Header() {
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
                            <Link className={classNames(
                                item.current
                                  ? 'border-indigo-500 text-gray-900'
                                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                              )}
                              aria-current={item.current ? 'page' : undefined}
                              to={item.link}>
                                  {item.name}
                              </Link>
                        ))}
                      </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                      <Menu as="div" className="ml-3 relative">
                        <div>
                          <Link to={"/profile"} className="bg-white flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <span className="sr-only">Open user menu</span>
                            <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt="" />
                          </Link>
                        </div>
                      </Menu>
                    </div>
                    <div className="-mr-2 flex items-center sm:hidden">
                      {/* Mobile menu button */}
                      <Disclosure.Button className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
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
                        <Link className={classNames(
                            item.current
                              ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                              : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
                            'block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
                          )}
                          aria-current={item.current ? 'page' : undefined}
                          to={item.link}>
                            <Disclosure.Button>
                                {item.name}
                            </Disclosure.Button>
                          </Link>
                    ))}
                  </div>
                  <div className="pt-4 pb-3 border-t border-gray-200">
                    <div className="flex items-center px-4">
                    
                      <div className="flex-shrink-0">
                        <Link to={"/profile"}>
                            <Disclosure.Button>
                            <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
                            </Disclosure.Button>
                        </Link>
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-medium text-gray-800">{user.name}</div>
                        <div className="text-sm font-medium text-gray-500">{user.email}</div>
                      </div>
                    
                    </div>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
      </>
    )
}
