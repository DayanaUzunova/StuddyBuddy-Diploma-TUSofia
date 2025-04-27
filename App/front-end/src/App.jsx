import { Routes, Route } from "react-router-dom";
import Home from "./components/home/Home";
import Register from "./components/register/Register"
import Header from "./components/header/Header";
import Login from "./components/login/Login";
import Logout from "./components/logout/Logout";

const App = () => {
  return (
    <>
      <Header />
      <div className="outer-box">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="logout" element={<Logout />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
