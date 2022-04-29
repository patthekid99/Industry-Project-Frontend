import { useState } from "react";
import data from "../MOCK_DATA.json";
import footer from "../components/Footer";
/*
screens: {
      mb: "376px",
      sm: "641px",
      md: "769px",
      lg: "1025px",
      xl: "1281px",
    }
*/
export default function DirectoryPage() {
  const [realtor, setRealtor] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  function displayProfile(realtor) {
    setRealtor(realtor);
  }
  return (
    <>
      <div
        className="flex 
        sm:ml-5 h-screen
        md:ml-5 mt-5 h-screen
        "
      >
        <div
          className="
          left-column hidden 
          sm:block mr-5"
        >
          <h2 className="pb-5">Directory</h2>
          <p className="text-sm mb-2">Search through {data.length} realtors</p>
          <div className="relative text-gray-600 focus-within:text-gray-400">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <button
                type="submit"
                className="
                p-1 
                focus:outline-none 
                focus:shadow-outline
                rounded-l-md"
              >
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </button>
            </span>
            <input
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
              type="text"
              name="q"
              className="
              py-2 text-sm 
              text-white 
              bg-gray-900 
              rounded-md 
              pl-10 
              focus:outline-none 
              focus:bg-white 
              focus:text-gray-900"
              placeholder="Search for a realtor"
              autoComplete="off"
            />
          </div>
          <div
            className="
          md:h-4/6"
          >
            <div
              className="
            md:h-5/6"
            >
              <ul
                className="
              md:
              mt-6
              overflow-y-scroll
              h-full
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
                    <li key={realtor.email} className="py-1">
                      <button onClick={() => displayProfile(realtor)}>
                        {realtor.first_name} {realtor.last_name}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
        <div
          className="
          w-screen p-6 
          mb: px-0 py-0"
        >
          <div
            className="
          bg-gradient-to-r from-green-400 to-blue-500 h-36 
          sm:max-w-full 
          md: px-5"
          ></div>
          <div
            className="
          pt-10 mb: px-5 
          sm:grid grid-cols-2 grid-rows-5
          md: mt-10"
          >
            <h1
              className="
          font-bold
          text-2xl"
            >
              {realtor.first_name} {realtor.last_name}
            </h1>
            <img
              className="
            border-4 border-stone-900
            rounded-full absolute top-32 
            mb: h-14 w-14 top-45 
            sm: h-20 w-20 top-40
            md: h-24 w-24 top-40"
              src={realtor.photo}
            ></img>
            <p
              className="
            line-clamp-4
            mb:py-1 
            sm:py-1 position relative
            top-120
            md:py-1"
            >
              <b>About Me </b>
              <br></br>
              {realtor.bioText}
            </p>
            <p
              className="
            mb:py-2
            md:py-4"
            >
              <b>Phone: </b>
              <br></br>
              {realtor.phonenumber}
            </p>
            <p
              className="
            mb:py-2
            md:py-4"
            >
              <b>Email:</b>
              <br></br>
              {realtor.email}
            </p>
            <p
              className="
            mb:py-2
            md:py-4"
            >
              <b>Company:</b>
              <br></br>
              {realtor.company}
            </p>
            <p
              className="
            mb:py-2
            md:py-4"
            >
              <b>Instagram:</b>
              <br></br>
              {realtor.instagram}
            </p>
            <p
              className="
            mb:py-2
            md:py-4"
            >
              <b>Facebook: </b>
              <br></br>
              {realtor.facebook}
            </p>
            <p
              className="
            mb:py-2
            md:py-4"
            >
              <b>Rating: </b>
              <br></br>
              {realtor.starRating}
            </p>
            <p
              className="
            mb:py-2
            md:py-4"
            >
              <b>Website: </b>
              <br></br>
              {realtor.website}
            </p>
            <p
              className="
            mb:py-2
            md:py-4"
            >
              <b>Languages: </b>
              <br></br>
              {realtor.primary_language}, {realtor.secondary_language}
            </p>
          </div>
        </div>
      </div>
      <footer
        className="
      mb: max-w-7xl
      bg-blue-500
      text-center
      h-20
      px-5
      pt-5
      text-sm
      text-white
      md: 
      position-absolute
      m-0
      p-0
      inset-y-0 bottom-0
      "
      >
        Intelectual Property of: Amainder Gill, Adrian Genosa, Guarav Joshi, and
        Eugene Im.
      </footer>
    </>
  );
}
