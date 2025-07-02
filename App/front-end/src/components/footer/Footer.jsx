import React from 'react';
import '../../style/footer.css';
import { useSelector } from 'react-redux';
import { lang } from '../../lang/lang';

export default function Footer({ visible = true }) {

    const language = useSelector(state => state.general.language);

    return (
        <footer className={`footer ${!visible ? 'footer-hidden' : ''}`}>
            <div className="footer-container container">
                <div className="footer-logo">
                    <h3>StudyBuddy</h3>
                    <p>{lang(language, 'footer_description')}</p>
                </div>

                <div className="footer-links">
                    <h4>{lang(language, 'explore')}</h4>
                    <a href="#features">{lang(language, 'features')}</a>
                    <a href="#about">{lang(language, 'about')}</a>
                    <a href="#contact">{lang(language, 'contact')}</a>
                    <a href="#terms">{lang(language, 'terms')}</a>
                </div>

                <div className="footer-social">
                    <h4>{lang(language, 'follow_us')}</h4>
                    <a href="#" aria-label="Twitter">{lang(language, 'twitter')}</a>
                    <a href="#" aria-label="Instagram">{lang(language, 'instagram')}</a>
                    <a href="#" aria-label="Facebook">{lang(language, 'facebook')}</a>
                </div>
            </div>

            <div className="footer-bottom">
                <p>
                    &copy; {new Date().getFullYear()} Dayana Uzunova. {lang(language, 'all_rights_reserved')}
                </p>
            </div>
        </footer>
    );
}
