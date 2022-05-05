import AppRouter from "./routes/AppRouter";
import Header from './components/header';
<<<<<<< Updated upstream
import Footer from './components/Footer';
=======
<<<<<<< HEAD
import Footer from './components/Footer';
=======
import { Link, useLocation } from "react-router-dom";
>>>>>>> b6f675461c7624c5d84ec2b0fbd7fa858e48cf7e
>>>>>>> Stashed changes

function App() {
  const location = useLocation()
  return (
    <>
    {location.pathname === "/" || location.pathname === "/login" || location.pathname === "/register" ?
    "" :
    <Header />}
    <AppRouter />
    <Footer />
   </>
  );
}

export default App;
