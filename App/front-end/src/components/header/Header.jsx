import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import '../../style/header.css';

export default function Header() {
  const { user, removeToken } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate('/')
  };

  return (
    <header>
      <h1 className='header-title'><p className="home" onClick={() => navigate('/login')}>Study Buddy</p></h1>
      <nav>
        {user ? (
          <div className="user">
            <p className='nav_button' onClick={() => navigate('/login')}>All Courses</p>
            <p className='nav_button' onClick={handleLogout}>Logout</p>
          </div>
        ) : (
          <div className="guest">
            <p className='nav_button' onClick={() => navigate('/login')}>Login</p>
            <p className='nav_button' onClick={() => navigate('/login')}>Register</p>
          </div>
        )}
      </nav>
    </header>
  );
}
