// import { useState, useEffect } from 'react';
// // import axios from 'axios';
// import data from '../Listing_MOCK_DATA.json'
// import '../myListing.css'
// import { Link } from "react-router-dom";

// export default function MyListingsPage() {
//     const [listings, setListings] = useState([])

//     useEffect(() => {
//         async function getMyListings() {
//             // var token = {"tokenString":"eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjVhMmRhYTBhLWFiOWItNDIyZi1hN2MwLTI4OTA4N2JjNjNiYyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6ImRldmVsb3BlckB0ZXN0LmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkRldmVsb3BlciIsImV4cCI6MTY1MTU3MDA1MywiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NDQzNDAvIiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NDQzNDAvIn0.xFE53d6ySLVQvFwF7N5puNBmHi9SuHR7h1nNHy_Ll7u0CCESIxEcAGsy5EOkNBYmnuQlRuD3ihKWfDZ5M2Od9A"}
            
//             // localStorage.setItem("myData",JSON.stringify(token))
//             // var mydata = JSON.parse(localStorage.getItem("myData"))
//             // if(mydata && mydata.tokenString){
//             //     const result = await axios.get('https://localhost:44340/api/Listing/', {
//             //         headers: {
//             //             Authorization: `Bearer ${mydata.tokenString}`
//             //         }
//             //     })
//                 // const developerListings = result.data
//                 const developerListings = data
//                 await setListings(developerListings)
//                 console.log(developerListings)
//             // }
//             // else{
//             //     console.log('no auth user')
//             // }
//         }
//         getMyListings()
//     }, [])
//     return (
//       <>
//         <div className="min-h-full py-10 bg-gray-100">
//           {/* <main> */}
//             <h2 className="block text-gray-600 text-lg mx-auto sm:px-6 lg:px-8 sm:rounded-[24px]">
//                 MY LISTINGS PAGE
//             </h2>
//           <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 sm:rounded-[24px] bg-white container">
//             <div className="pt-8 text-center">
//                 <Link to={'/newlisting'}>
//                     <button className="text-center rounded-lg p-4 bg-green-600  text-grey-500 font-bold text-lg">
//                         New Listing
//                     </button>
//                 </Link>
//             </div>
//             <div className="py-4 grid grid-cols-3 grid-flow-cols gap-9 sm:grid-cols-3 sm:gap-x-6">
//               {/* <div className="shadow-lg group container rounded-md bg-white  max-w-full flex justify-center items-center mx-auto">
//       <ul className="py-6 px-4 grid grid-flow-cols grid-cols-3 gap-9 ">
//           {listings?.map((listing) => (
//               <li key={listing.projectID} className="py-4 flex content-div shadow-lg group container  rounded-md bg-white  max-w-sm h-64 w-67 mx-auto">
//                   <div className="">
//                       <img className="" src={listing.projectImage} alt="" />
                  
//                       <div class="w-full rounded-t-md">
//                           <div class="p-2 m-4 w-16 h-16 text-center bg-gray-700 rounded-full text-white float-right fd-cl group-hover:opacity-25">
//                               <span class="text-base tracking-wide  font-bold border-b border-white font-sans"> 3</span>
//                               <span class="text-xs tracking-wide font-bold uppercase block font-sans">May</span>
//                           </div>
//                       </div>
//                       <div className="py-8 px-4 bg-white  rounded-b-md fd-cl hover:opacity-25">
//                           <span className="block text-lg text-gray-800 font-bold tracking-wide">{listing.streetNum} {listing.streetName}</span>
//                           <span className="block text-gray-600 text-sm">{listing.city}</span>
//                           <span className="block text-gray-600 text-sm">{listing.Description}</span>
//                       </div>
//                   </div>
//                   <div class="absolute opacity-0 fd-sh hover:opacity-100">
//                       {/* <span class="text-3xl font-bold text-white tracking-wider leading-relaxed font-sans">Paris city of light</span>
//                       <div class="pt-8 text-center">
//                           <button class="text-center rounded-lg p-4 bg-white  text-gray-700 font-bold text-lg">Edit</button>
//                       </div>
//                       <div class="pt-8 text-center">
//                           <button class="text-center rounded-lg p-4 bg-white  text-red-700 font-bold text-lg">Delete</button>
//                       </div>
//                   </div>
//               </li>
//           ))}
//       </ul>
//       </div>
//   </main> */}

//               {listings?.map((listing) => (
//                 <>
//                   <div className="py-4 shadow-2xl group container  transform transition-all hover:-translate-y-2 duration-300 rounded-md bg-white  max-w-sm flex justify-center rounded-t-lg  mx-auto content-div">
//                     <div className=" flex-wrap flex">
//                       <div className="absolute p-2 m-4 w-16 h-16 text-center bg-gray-700 rounded-full text-white float-right fd-cl group-hover:opacity-25">
//                         <span className="text-base tracking-wide  font-bold border-b border-white font-sans">
//                           12
//                         </span>
//                         <span className="text-xs tracking-wide font-bold uppercase block font-sans">
//                           April
//                         </span>
//                       </div>
//                       <div className="mx-auto rounded-t-md">
//                         <img className="" src={listing.projectImage} alt="" />
//                       </div>
//                       <div className="py-8 px-4 bg-white  rounded-b-md fd-cl group-hover:opacity-25">
//                         <span className="block text-lg text-gray-800 font-bold tracking-wide">
//                           {listing.projectName}
//                         </span>
//                         <span className="block text-gray-600 text-sm">
//                           {listing.projectDescription}
//                         </span>
//                       </div>
//                     </div>
//                     {/* <div className="realtive opacity-0 fd-sh hover:opacity-100">
//               <div className="pt-8 text-center">
//                 <button className="text-center rounded-lg p-4 bg-white  text-gray-700 font-bold text-lg">
//                   Edit
//                 </button>
//               </div>
//               <div className="pt-8 text-center">
//                 <button className="text-center rounded-lg p-4 bg-white  text-red-500 font-bold text-lg">
//                   Delete
//                 </button>
//               </div>
//             </div> */}
//                   </div>
//                 </>
//               ))}
//               <li class="flex">
//       <Link to={"/newlisting"} className="hover:border-blue-500 hover:border-solid hover:bg-white hover:text-blue-500 group w-full flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-sm leading-6 text-slate-900 font-medium py-3">
//         <svg class="group-hover:text-blue-500 mb-1 text-slate-400" width="20" height="20" fill="currentColor" aria-hidden="true">
//           <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
//         </svg>
//         New project
//       </Link>
//     </li>
//             </div>
//           </div>
//         </div>
//       </>
//     );
// }