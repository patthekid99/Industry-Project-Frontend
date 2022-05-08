import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/landingPage";
import LoginPage from "../pages/loginPage";
import RegisterPage from "../pages/registerPage";
import HomePage from "../pages/homePage";
import MyListingsPage from "../pages/myListingsPage";
import ProfilePage from "../pages/profilePage";
import Tabs from "../Tabs/Tabs";
import FindRealtor from "../pages/findRealtorPage";
import ListingDetails from "../pages/listingDetailsPage";
import NewListingPage from "../pages/newListingPage";
import FindDeveloper from "../pages/findDeveloperPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/realtordirectory" element={<FindRealtor />} />
      <Route path="/developerdirectory" element={<FindDeveloper />} />
      {<Route path="/listings" element={<MyListingsPage />} /> }
      <Route path="/listings/:id" element={<ListingDetails />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/tabs" element={<Tabs />} />
      <Route path="/newlisting" element={<NewListingPage />} />
    </Routes>
  );
}
