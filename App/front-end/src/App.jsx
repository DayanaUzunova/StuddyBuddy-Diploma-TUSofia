import { Routes, Route } from 'react-router-dom';
import Home from './components/home/Home';
import Register from './components/register/Register';
import Header from './components/header/Header';
import Login from './components/login/Login';
import Logout from './components/logout/Logout';
import PrivateRoute from './components/util/privateRoute';
import { useAuth } from './context/AuthContext';
import './App.css';

const App = () => {
  const { user } = useAuth();

  return (
    <>
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
        </Routes>
      </div>
    </>
  );
};

export default App;
