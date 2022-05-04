import AppRouter from "./routes/AppRouter";
import Header from './components/header';
import { Link, useLocation } from "react-router-dom";

function App() {
  const location = useLocation()
  return (
    <>
    {location.pathname === "/" || location.pathname === "/login" || location.pathname === "/register" ?
    "" :
    <Header />}
    <AppRouter />
   </>
  );
}

export default App;
