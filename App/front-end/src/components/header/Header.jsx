import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import '../../style/header.css';

import flagUs from '../../../assets/icons/usFlag.png';
import flagBg from '../../../assets/icons/bulgariaFlag.png';
import flagGer from '../../../assets/icons/germantFlag.png';
import flagNl from '../../../assets/icons/netherlandsFlag.png';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import LangModal from '../modals/LangModal';

export default function Header() {
  const { user, removeToken } = useAuth();
  const navigate = useNavigate();

  const [langModalOpen, setLangModalOpen] = useState(false);

  const language = useSelector(state => state.general.language);

  const handleLanguageSelect = (lang) => {
    setLangModalOpen(false);
  };

  const handleLogout = async () => {
    await removeToken();
    navigate('/')
  };

  const flags = {
    bg: flagBg,
    en: flagUs,
    nl: flagNl,
    de: flagGer
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
            {
              user &&
              <img className='lang_btn' src={flags[language]} onClick={() => setLangModalOpen(true)} />
            }
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
