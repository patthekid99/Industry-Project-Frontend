import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/landingPage';
import LoginPage from '../pages/loginPage';
import RegisterPage from '../pages/registerPage';
import HomePage from '../pages/homePage';
import DirectoryPage from '../pages/directoryPage';
import MyListingsPage from '../pages/myListingsPage';
import ProfilePage from '../pages/profilePage';
import Header from '../components/header';
import { Fragment } from 'react';



export default function AppRouter() {
    return (
        <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/home' element={<HomePage />} />
            <Route path='/directory' element={<DirectoryPage />} />
            <Route path='/listings' element={<MyListingsPage />} />
            <Route path='/profile' element={<ProfilePage />} />  
        </Routes>
    )
}
