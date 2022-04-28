import { useState } from "react";
import data from "../MOCK_DATA.json";

export default function DirectoryPage() {
  const [realtor, setRealtor] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  function displayProfile(realtor) {
    setRealtor(realtor);
  }
  return (
    <div className="flex">
      <div className="left-column">
        <h2>Directory</h2>
        <p>Search directory of {data.length} realtors</p>
        <div className="relative text-gray-600 focus-within:text-gray-400">
      <span className="absolute inset-y-0 left-0 flex items-center pl-2">
        <button type="submit" className="p-1 focus:outline-none focus:shadow-outline"> 
          <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </button>
      </span>
      <input onChange={(event) => {
            setSearchTerm(event.target.value);
          }} type="text" name="q" className="py-2 text-sm text-white bg-gray-900 rounded-md pl-10 focus:outline-none focus:bg-white focus:text-gray-900" placeholder="Search for a realtor" autoComplete="off"/>
    </div>
        <div className="border-2 border-zinc-900">
          <div>
            <ul>
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
                  <li key={realtor.email}>
                    <button onClick={() => displayProfile(realtor)}>
                      {realtor.first_name} {realtor.last_name}
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="w-screen p-6">
        <div className="bg-cyan-600 h-36">HERO</div>
        <div className="pt-28">
          <img className="rounded-full absolute top-32" src={realtor.photo}></img>
          <h1 className="font-extrabold">
            {realtor.first_name} {realtor.last_name}
          </h1>
          <p>
            <b>About Me </b>
            <br></br>
            {realtor.bioText}
          </p>
          <p>
            <b>Phone: </b>
            {realtor.phonenumber}
          </p>
          <p>
            <b>Email:</b> {realtor.email}
          </p>
          <p>
            <b>Company:</b> {realtor.company}
          </p>
          <p>
            <b>Instagram:</b> {realtor.instagram}
          </p>
          <p>
            <b>Facebook: </b>
            {realtor.facebook}
          </p>
          <p>
            <b>Rating: </b>
            {realtor.starRating}
          </p>
          <p>
            <b>Website: </b>
            {realtor.website}
          </p>
          <p>
            <b>Languages: </b>
            {realtor.primary_language}, {realtor.secondary_language}
          </p>
        </div>
      </div>
    </div>
  );
}
