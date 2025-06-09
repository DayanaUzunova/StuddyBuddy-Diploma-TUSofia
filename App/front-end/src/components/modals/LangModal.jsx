import React from 'react';
import '../../style/langModal.css';
import { useDispatch } from 'react-redux';
import { setLanguage } from '../../redux/slices/generalSlice';

const LangModal = ({ isOpen, onClose, onSelect }) => {
    const dispatch = useDispatch();

    if (!isOpen) return null;

    return (
        <div className="lang-modal-overlay" onClick={onClose}>
            <div className="lang-modal" onClick={(e) => e.stopPropagation()}>
                <h3>Select Language</h3>
                <ul className="lang-list">
                    <li onClick={() => dispatch(setLanguage('en'))}>🇬🇧 English (ENG)</li>
                    <li onClick={() => onSelect('nl')}>🇳🇱 Dutch (NL)</li>
                    <li onClick={() => dispatch(setLanguage('bg'))}>🇧🇬 Bulgarian (BG)</li>
                    <li onClick={() => onSelect('de')}>🇩🇪 German (GER)</li>
                </ul>
            </div>
        </div>
    );
};

export default LangModal;