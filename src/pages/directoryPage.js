import { useState, useEffect } from "react";
// import data from "../MOCK_DATA.json";
import { Dropdown } from "../components/Dropdown";
import  axios  from "axios";
import { FaHouseUser } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
/*
screens: {
      mb: "376px",
      sm: "641px",
      md: "769px",
      lg: "1025px",
      xl: "1281px",
    }

Scheme that Steve wants:
- Dark Green Button
- Gold Letters inside the button
- Footer is TBD
- Hero image/Profile background is TBD
*/
export default function DirectoryPage() {
  const [token, setToken] = useState(""); // Auth Token
  const [show, setShow] = useState(false); // Filter Toggle hide/show
  const [realtor, setRealtor] = useState({}); // Getting single realtor details on click
  const [realtors, setRealtors] = useState([]); // Getting all realtors from API
  const [languages, setLanguages] = useState([]); // Getting all languages from API
  const [realtorLang, setRealtorLang] = useState([{}]); // Used to filter realtors by specific language
  
  const baseURL = "https://localhost:44340/api/directory/realtors/"

  useEffect(() => {
    async function getRealtors() {
      var mydata = JSON.parse(localStorage.getItem("myData"));
      setToken(mydata.tokenString);
      const result = await axios.get(
        baseURL,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const res_languages = await axios.get(
        "https://localhost:44340/api/language/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const single_realtor = await axios.get(
        baseURL+(result.data[0].realtorId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      var langlbah = [];
      const singleRealtor = single_realtor.data;
      setRealtor(singleRealtor);
      console.log(singleRealtor);

      single_realtor.data.realtorLanguages.forEach((l) => {
        const something = res_languages.data.find(
          (lang) => lang.languageId === l.languageId
        );
        langlbah.push(something);
      });

      setRealtorLang(langlbah);
      const resultLanguages = res_languages.data;
      const resultRealtors = result.data;
      setLanguages(resultLanguages);
      setRealtors(resultRealtors);
    }
    getRealtors();
  }, []);

  const companies = [
    ...new Set(realtors.map((realtor) => realtor.companyName)),
  ];

  const rating = [1, 2, 3, 4, 5];

  const Languages = languages.map((language) => ({
    label: language.languageName,
    value: language.languageId,
  }));
  const Companies = companies.map((company) => ({
    label: company,
    value: company,
  }));

  async function displayProfile(id) {
    const single_realtor = await axios.get(
      baseURL+id,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    var langlbah = [];
    const singleRealtor = single_realtor.data;
    setRealtor(singleRealtor);
    single_realtor.data.realtorLanguages.forEach((l) => {
      const something = languages.find(
        (lang) => lang.languageId === l.languageId
      );
      langlbah.push(something);
    });

    setRealtorLang(langlbah);
  }

  function toggleFilter(show) {
    if (show == false) {
      setShow(true);
    } else {
      setShow(false);
    }
  }

  async function filterByLanguage(id) {

    const result = await axios.get(baseURL+`lang/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setRealtors(result.data);
    if (result.data.length > 0) {
      displayProfile(result.data[0]);
    }
  }
  async function searchRealtor(query) {
    var result;
    if (!query) {
      result = await axios.get(
        baseURL,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } else {
      result = await axios.get(baseURL+`name/${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    setRealtors(result.data);
    if (result.data.length > 0) {
      displayProfile(result.data[0]);
    }
  }
  return (
    <>
      <div
        className="flex 
        sm:ml-5 h-3/4
        md:ml-5 mt-5 h-3/4
        "
      >
        <Sidebar
          className="
          sm: hidden"
        ></Sidebar>
        <div
          className="
          left-column hidden 
          sm:block mr-5"
        >
          <h2 className="pb-5">Directory</h2>
          <p className="text-sm mb-2">Search through {realtors.length} realtors</p>
          <div className="relative text-amber-400 focus-within:text-gray-400">
            <span className="absolute inset-y-0 left-0 flex items-center">
            <button
                type="submit"
                className="
                p-1 
                focus:outline-none 
                focus:shadow-outline
                rounded-l-md
                dropdown-toggle"
                onClick={() => toggleFilter(show)}
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
                searchRealtor(event.target.value);
              }}
              type="text"
              name="q"
              className="
              py-2 pl-8 text-sm 
              text-white 
              bg-gray-900 
              rounded-md 
              focus:outline-none 
              focus:bg-white 
              focus:text-amber-400"
              placeholder="Search for a realtor"
              autoComplete="off"
            />
          </div>
          <div className="filter-container">
            {show ? (
              <form>
                <Dropdown
                  onChange={(event) => {
                    filterByLanguage(event.value);
                  }}
                  placeholder="Filter by Language"
                  options={Languages}
                />
                {/* <Dropdown
                  onChange={(event) => {
                    setFilterTerm([...filterTerm, event.value]);
                  }}
                  placeholder="Filter by Company"
                  options={Companies}
                /> */}
                {/* <Dropdown placeholder="Filter by Rating" options={Rating} /> */}
              </form>
            ) : null}
          </div>
          <div
            className="
          md:h-4/6
          sm:h-4/6"
          >
            <div
              className="
            md:h-100vh
            sm:h-4/5
            lg:h-4/5 ml-2"
            >
              <ul
                className="
              md:
              mt-6
              overflow-y-scroll
              h-full
              sm:
              mt-6
              overflow-y-scroll
              h-full
              lg: h-5/6
              "
              >
                {realtors &&
                  realtors.map((realtor) => (
                    <li key={realtor.email} className="py-1">
                      <button onClick={() => displayProfile(realtor.realtorId)}>
                        {realtor.firstName} {realtor.lastName}
                      </button>
                    </li>
                  ))}
              </ul>
              <FaHouseUser
                className="
              lg: 
              h-24
              w-24
              ml-5
              mt-10"
              ></FaHouseUser>
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
          bg-stone-900 h-36 
          sm:max-w-full 
          md: px-5"
          ></div>
          <div
            className="
          pt-10 mb: px-5 
          sm:grid grid-cols-2 grid-rows-5
          md: mt-10
          lg: h-4/6"
          >
            <h1
              className="
          font-bold
          text-2xl"
            >
              {realtor.firstName} {realtor.lastName}
            </h1>
            <img
              className="
            border-4 border-amber-400
            rounded-full absolute top-32 
            mb: h-14 w-14 top-45 
            sm: h-20 w-20 top-40
            md: h-24 w-24 top-40
            lg: h-28 w-28 top-40 ml-5"
              src={realtor.profilePic}
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
              {realtor.phoneNumber}
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
              {realtor.companyName}
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
              {realtor.avgStarRating}
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
              {realtorLang.map((l) => l.languageName)}
            </p>
          </div>
        </div>
      </div>

      <footer
        className="
        mb: 
        fixed
        bottom-0
        left-0
        right-0
        text-center
        text-white
        bg-gray-900
        md:
        fixed
        inset-y-0 bottom-0
        text-center
        text-base
        text-white
        py-5
        px-5
        lg:
        h-28
        pt-10
        px-10
        text-lg

      "
      >
        © 2022 Copyright
      </footer>
    </>
  );
}
