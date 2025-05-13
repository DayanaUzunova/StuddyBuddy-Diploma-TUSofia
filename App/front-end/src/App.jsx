import { Routes, Route } from 'react-router-dom';
import Home from './components/home/Home';
import Register from './components/register/Register';
import Header from './components/header/Header';
import Login from './components/login/Login';
import PrivateRoute from './components/util/privateRoute';
import Footer from './components/footer/Footer';
import { useAuth } from './context/AuthContext';
import './App.css';
import Playground from './components/playground/Playground';
import { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import axiosInstance from './api/api';

const App = () => {
  const [footerVisible, setFooterVisible] = useState(true);
  const { user } = useAuth();
  const location = useLocation();

  const checkTokenExpiration = () => {
    try {
      const decoded = jwt_decode(token);

      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        setUser(null);
        return;
      }
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("token");
      setUser(null);
      return;
    };
  };

  // Hide footer on "/playground"
  useEffect(() => {
    setFooterVisible(location.pathname !== "/playground");
  }, [location.pathname]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    /*   if (!token) {
        setUser(null);
        return;
      }; */

    // checkTokenExpiration();

  }, []);

  return (
    <div className="app-wrapper">
      <Header />
      <div className="outer-box">
        <Routes>
          <Route
            path="/register"
            element={
              <PrivateRoute isAllowed={!user}>
                <Register />
              </PrivateRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PrivateRoute isAllowed={!user}>
                <Login />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Home />} />
          <Route
            path="/playground"
            element={
              <PrivateRoute isAllowed={!!user}>
                <Playground setFooterVisibility={setFooterVisible} />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
      {footerVisible && <Footer />}
    </div>
  );
};

export default App;