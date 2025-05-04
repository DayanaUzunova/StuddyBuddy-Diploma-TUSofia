import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import '../../style/header.css';
import flagUs from '../../../assets/icons/usFlag.png'

export default function Header() {
  const { user, removeToken } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate('/')
  };

  return (
    <header>
      <div className='nav_container'>
        <h1 className='header-title'><p className="home" onClick={() => navigate('/')}>Study Buddy</p></h1>
        <nav>
          {user ? (
            <div className="user">
              <p className='nav_button' onClick={() => navigate('/login')}>All Courses</p>
              <p className='nav_button' onClick={handleLogout}>Logout</p>
            </div>
          ) : (
            <div className="guest">
              <p className='nav_button' onClick={() => navigate('/login')}>Login</p>
              <p className='nav_button' onClick={() => navigate('/register')}>Register</p>
            </div>
          )}
          <div className='language_picker'>
            <img className='lang_btn' src={flagUs} />
          </div>
        </nav>
      </div>
    </header >
  );
}
