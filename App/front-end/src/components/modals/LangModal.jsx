import React from 'react';
import '../../style/langModal.css';
import { useDispatch } from 'react-redux';
import { setLanguage } from '../../redux/slices/generalSlice';
import axiosInstance from '../../api/api.jsx';

const LangModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();

    const handleLangSelect = async (lang) => {
        try {
            // 1. Update backend
            await axiosInstance.post('/api/user/change-lang', { lang }, { withCredentials: true });

            // 2. Update Redux
            dispatch(setLanguage(lang));

            // 3. Close modal
            onClose();
        } catch (err) {
            console.error('Language update error:', err);
            alert('Failed to change language');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="lang-modal-overlay" onClick={onClose}>
            <div className="lang-modal" onClick={(e) => e.stopPropagation()}>
                <h3>Select Language</h3>
                <ul className="lang-list">
                    <li onClick={() => handleLangSelect('en')}>🇬🇧 English (ENG)</li>
                    <li onClick={() => handleLangSelect('nl')}>🇳🇱 Dutch (NL)</li>
                    <li onClick={() => handleLangSelect('bg')}>🇧🇬 Bulgarian (BG)</li>
                    <li onClick={() => handleLangSelect('de')}>🇩🇪 German (GER)</li>
                </ul>
            </div>
        </div>
    );
};

export default LangModal;
