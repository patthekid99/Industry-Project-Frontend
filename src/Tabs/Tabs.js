import React, { useState } from "react";
import data from "../MOCK_DATA.json";
import { TabGroup } from "@statikly/funk";
import { MdArrowBack } from "react-icons/md";

export default function Tabs() {
  const [realtor, setRealtor] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  function displayProfile(realtor) {
    setRealtor(realtor);
  }

  return (
    <div>
      <div>
        <div className="flex">
          <MdArrowBack className="h-6 w-6"></MdArrowBack>
          <p className="">Directory</p>
        </div>
        <div className="border-2 border-zinc-900 h-24 mt-4 mb-12 bg-blue-300">
          <img
            className="rounded-full relative top-[9vh] left-[8vw] h-16 w-16 bg-red-500 border-2 border-zinc-900"
            alt="profile image"
          ></img>
        </div>
        <div className="h-full w-screen flex flex-col justify-center items-center mt-0 pt-0">
          <TabGroup numTabs={3} direction={TabGroup.direction.HORIZONTAL}>
            <TabGroup.TabList>
              <TabGroup.Tab
                index={0}
                className="h-12 px-12 transition-colors mb-2 duration-150"
                activeClassName="bg-black text-white"
                inactiveClassName="text-black"
              >
                Profile
              </TabGroup.Tab>
              <TabGroup.Tab
                index={1}
                className="h-12 px-12 transition-colors mb-2 duration-150"
                activeClassName="bg-black text-white"
                inactiveClassName="text-black"
              >
                Reviews
              </TabGroup.Tab>
            </TabGroup.TabList>
            <TabGroup.TabPanel
              index={0}
              className="p-16 transition-all transform h-64 flex flex-col border-2 border-zinc-900"
              activeClassName="opacity-100 duration-500 translate-x-0"
              inactiveClassName="absolute opacity-0 -translate-x-2"
            >
              <ul className="font-extrabold max-h-18 overflow-hidden">
                {data
                  .filter((realtor) => {
                    if (searchTerm == "") {
                      return realtor;
                    } else if (
                      realtor.first_name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      realtor.last_name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    ) {
                      return realtor;
                    }
                  })
                  .map((realtor) => (
                    <li key={realtor.email} className="py-1">
                      <button onClick={() => displayProfile(realtor)}>
                        {realtor.first_name} {realtor.last_name}
                      </button>
                    </li>
                  ))}
              </ul>
            </TabGroup.TabPanel>
            <TabGroup.TabPanel
              index={1}
              className="p-16 transition-all transform h-64 flex flex-col border-2 border-zinc-900"
              activeClassName="opacity-100 duration-500 translate-x-0"
              inactiveClassName="absolute opacity-0 -translate-x-2"
            >
              <h1 className="font-extrabold">Reviews go here</h1>
            </TabGroup.TabPanel>
          </TabGroup>
        </div>
      </div>
      <div>
        <footer
          className="
        fixed
        bottom-0
        left-0
        right-0
        h-12
        text-center
        text-white
        bg-gray-900
        "
        >
          © 2022 Copyright
        </footer>
      </div>
    </div>
  );
}
