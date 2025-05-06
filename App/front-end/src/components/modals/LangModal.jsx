import React from 'react';
import '../../style/langModal.css';

const LangModal = ({ isOpen, onClose, onSelect }) => {
    if (!isOpen) return null;

    return (
        <div className="lang-modal-overlay" onClick={onClose}>
            <div className="lang-modal" onClick={(e) => e.stopPropagation()}>
                <h3>Select Language</h3>
                <ul className="lang-list">
                    <li onClick={() => onSelect('en')}>🇬🇧 English (ENG)</li>
                    <li onClick={() => onSelect('nl')}>🇳🇱 Dutch (NL)</li>
                    <li onClick={() => onSelect('bg')}>🇧🇬 Bulgarian (BG)</li>
                    <li onClick={() => onSelect('de')}>🇩🇪 German (GER)</li>
                </ul>
            </div>
        </div>
    );
};

export default LangModal;