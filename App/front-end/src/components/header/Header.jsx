import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import '../../styles/navigation.css';

export default function Header() {
  const { user } = useAuth();

  return (
    <header>
      <h1 className='header-title'><Link className="home" to="/">Study Buddy</Link></h1>
      <nav>
        {user ? (
          <div id="user">
            <Link to="/courses">All Courses</Link>
            <Link to="/logout">Logout</Link>
          </div>
        ) : (
          <div id="guest">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        )}
      </nav>
    </header>
  );
}
