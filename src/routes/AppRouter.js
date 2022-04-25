import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/landingPage';
import LoginPage from '../pages/loginPage';
import RegisterPage from '../pages/registerPage';

export default function AppRouter() {
    return (
        <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />      
        </Routes>
    )
}
