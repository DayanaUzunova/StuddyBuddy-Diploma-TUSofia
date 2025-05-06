import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import '../../style/header.css';
import flagUs from '../../../assets/icons/usFlag.png'
import { useState } from 'react';
import LangModal from '../modals/LangModal';

export default function Header() {
  const { user, removeToken } = useAuth();
  const navigate = useNavigate();

  const [langModalOpen, setLangModalOpen] = useState(false);

  const handleLanguageSelect = (lang) => {
    console.log('Selected language:', lang);
    setLangModalOpen(false);
  };

  const handleLogout = () => {
    removeToken();
    navigate('/')
  };

  return (
    <header>
      <div className='nav_container'>
        <h1 className='header-title'><p className="home" onClick={() => navigate('/')}>StudyBuddy</p></h1>
        <nav>
          {user ? (
            <div className="user">
              <p className='nav_button' onClick={() => navigate('/playground')} >Playground 🕹️</p>
              <p className='nav_button' onClick={handleLogout}>Logout <span className="flipped">🏃‍♂️</span></p>
            </div>
          ) : (
            <div className="guest">
              <p className='nav_button' onClick={() => navigate('/register')}>Register 📝</p>
              <p className='nav_button' onClick={() => navigate('/login')}>Login 🔐</p>
            </div>
          )}
          <div className='language_picker'>
            <img className='lang_btn' src={flagUs} onClick={() => setLangModalOpen(true)} />
          </div>
        </nav>
      </div>

      <LangModal
        isOpen={langModalOpen}
        onClose={() => setLangModalOpen(false)}
        onSelect={handleLanguageSelect}
      />
    </header >
  );
}
