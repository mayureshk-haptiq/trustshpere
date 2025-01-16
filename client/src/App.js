import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from 'react-router-dom';
import Navbar from "./components/NavBar";
import Footer from './components/Footer';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CrimeAnalysis from "./pages/CrimeAnalysis";
import Articles from "./pages/Articles";
import ProtectedRoute from "./pages/ProtectedRoute";
import ProtectData from "./pages/ProtectData";
import { AuthContext } from './context/AuthContext';

const NotFound = () => <div>Page Not Found</div>;

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/articles" element={<Articles />} />
            <Route path="/protectData" element={<ProtectData />} />
            <Route path="/crimeAnalysis" element={<CrimeAnalysis />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer/>
      </Router>
    </>
  );
};

export default App;
