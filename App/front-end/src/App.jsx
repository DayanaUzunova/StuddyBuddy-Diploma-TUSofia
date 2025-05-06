import { Routes, Route } from 'react-router-dom';
import Home from './components/home/Home';
import Register from './components/register/Register';
import Header from './components/header/Header';
import Login from './components/login/Login';
import Logout from './components/logout/Logout';
import PrivateRoute from './components/util/privateRoute';
import Footer from './components/footer/Footer'; // ⬅️ Import Footer
import { useAuth } from './context/AuthContext';
import './App.css';
import Playground from './components/playground/Playground';
import { useState } from 'react';

const App = () => {
  const [footerVisible, setFooterVisible] = useState(true);

  const { user } = useAuth()

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
      <Footer  />
    </div>
  );
};


export default App;
