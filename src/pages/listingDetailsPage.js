import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import axios from "axios";
import Geocode from "react-geocode";

const APIKEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
Geocode.setApiKey(APIKEY);
Geocode.setRegion("ca");
Geocode.setLocationType("ROOFTOP");

export default function ListingDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState({ developer: {}, project: {} });
  const [marker, setMarker] = useState({ lat: 49.2827, lng: -123.1207 });

  useEffect(() => {
    async function getListings() {
      const results = await axios.get(
        `${process.env.REACT_APP_GLOBAL_API}api/home/${id}`
      );
      const result = results.data[0];
      console.log(result);
      Geocode.fromAddress(
        result.project.streetNum +
          " " +
          result.project.streetName +
          " " +
          result.project.city +
          " " +
          result.project.postalCode
      ).then((response) => {
        const { lat, lng } = response.results[0].geometry.location;
        result.project.lat = lat;
        result.project.lng = lng;
        setMarker({ lat: lat, lng: lng });
      });
      setListing(result);
    }
    getListings();
    console.log(listing);
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <div className="py-0 sm:py-10 sm:px-8 px-0">
          <main>
            <div className="max-w-7xl mx-auto sm:rounded-[24px] bg-white">
              <section className="text-gray-600 body-font overflow-hidden">
                <div className="container px-5 py-5 mx-auto">
                  <div className="lg:w-4/5 mx-auto flex flex-wrap">
                    <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
                      <h2 className="text-sm title-font text-gray-500 tracking-widest">
                        {listing.developer.developerName}
                      </h2>
                      <h1 className="text-gray-900 text-3xl title-font font-medium mb-4">
                        {listing.project.projectName}
                      </h1>
                      <p className="leading-relaxed mb-4">
                        {listing.project.projectDescription}
                      </p>
                      <div className="flex border-t border-gray-200 py-2">
                        <span className="text-gray-500">Address</span>
                        <span className="ml-auto text-gray-900">
                          {listing.project.streetNum +
                            " " +
                            listing.project.streetName +
                            ", " +
                            listing.project.city}
                        </span>
                      </div>
                      <div className="flex border-t border-b mb-6 border-gray-200 py-2">
                        <span className="text-gray-500">Project Status</span>
                        <span className="ml-auto text-gray-900">
                          {listing.project.projectStatus}
                        </span>
                      </div>
                      <div className="flex pb-2" style={{ height: "30vh" }}>
                        <MapContainer
                          center={[marker.lat, marker.lng]}
                          zoom={14}
                          scrollWheelZoom={false}
                          style={{ height: "30vh" }}
                        >
                          <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
                          />
                          <Marker position={[marker.lat, marker.lng]}></Marker>
                        </MapContainer>
                      </div>
                    </div>
                    <img
                      alt="ecommerce"
                      className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
                      src={listing.project.projectImage}
                    />
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
