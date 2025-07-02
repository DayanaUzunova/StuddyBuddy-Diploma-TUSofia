import React, { useEffect } from 'react';
import '../../style/landing.css'
import { useAuth } from '../../context/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { lang } from '../../lang/lang';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/api';
import { setLanguage } from '../../redux/slices/generalSlice';

export default function LandingPage() {
    const dispatch = useDispatch();

    const language = useSelector(state => state.general.language);
    const { user } = useAuth();

    const navigate = useNavigate();

    const getLang = async (user) => {
        try {
            const res = await axiosInstance.get('/api/user/get-lang', { withCredentials: true });

            if (!res) {
                throw new Error('Error getting lang!');
            };

            dispatch(setLanguage(res?.data?.lang));
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getLang()
    }, []);

    return (
        <div className="landing">
            <section className="hero container">
                <div className="hero-content" style={{ marginTop: '20px' }}>
                    <h1>{lang(language, 'your_pers_learning_companion')}</h1>
                    <p>{lang(language, 'organize_and_study')}</p>
                </div>
            </section>

            <section className="features">
                <h2>{lang(language, 'what_you_get')}</h2>
                <div className="feature-grid">
                    <div className="feature-card">{lang(language, 'chat_with_student')}</div>
                    <div className="feature-card">{lang(language, 'play_edu_games')}</div>
                    <div className="feature-card">{lang(language, 'level_up_and_earn')}</div>
                    <div className="feature-card">{lang(language, 'test_your_know')}</div>
                </div>
            </section>

            <section className="final-cta container">
                <h2>{lang(language, 'ready_to_play')}</h2>
                <button className="primary-btn" onClick={() => navigate('/playground')}>{!user ? "Join Now" : 'Jump to the Playground! 🕹️'}</button>
            </section>
        </div>

    );
}
