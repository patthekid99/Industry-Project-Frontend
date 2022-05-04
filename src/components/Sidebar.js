import React, { useState } from "react";
import { GrClose } from "react-icons/gr";
import data from "../MOCK_DATA.json";

export default function () {
  const [isOpen, setIsOpen] = useState(false);
  const [realtor, setRealtor] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  function displayProfile(realtor) {
    setRealtor(realtor);
  }

  return (
    <>
      {isOpen ? (
        <GrClose
          className="flex text-4xl text-white items-center cursor-pointer fixed right-4 top-14 z-50"
          onClick={() => setIsOpen(false)}
        >
          x
        </GrClose>
      ) : (
        <svg
          onClick={() => setIsOpen(true)}
          className="fixed z-30 flex items-center cursor-pointer right-4 top-24"
          fill="#FFFFFF"
          viewBox="0 0 100 80"
          width="30"
          height="30"
        >
          <rect width="100" height="10"></rect>
          <rect y="30" width="100" height="10"></rect>
          <rect y="60" width="100" height="10"></rect>
        </svg>
      )}
      <div
        className={`top-0 right-0 w-[40vw] bg-slate-200 p-5 text-white fixed h-full z-40  ease-in-out duration-300 ${
          isOpen ? "translate-x-0 " : "translate-x-full"
        }`}
      >
        <h3
          className="
        mt-20 
        text-base 
        text-black"
        >
          <input
            className="
          items-center
          w-full"
            onChange={(event) => {
              setSearchTerm(event.target.value);
            }}
          />
          <ul
            className="
            items-center
            overflow-y-scroll
            h-full
            h-5/6
            "
          >
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
                <li
                  key={realtor.email}
                  className="
                py-1 
                items-center
                h-5/6"
                >
                  <button onClick={() => displayProfile(realtor)}>
                    {realtor.first_name} {realtor.last_name}
                  </button>
                </li>
              ))}
          </ul>
        </h3>
      </div>
    </>
  );
}
