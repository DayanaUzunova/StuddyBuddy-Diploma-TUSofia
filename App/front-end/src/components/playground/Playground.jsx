import React, { useEffect, useState } from 'react';
import '../../style/playground.css';
import { useAuth } from '../../context/AuthContext';

import TeacherGames from './sections/teacher/TeacherGames';
import StudentGames from './sections/student/StudentGames';
import TeacherProfile from './sections/teacher/TeacherProfile';
import CardGame from './sections/student/CardGame';

import AdminProfile from './sections/admin/AdminProfile'; // Create this
import UsersModeration from './sections/admin/UsersModeration'; // Create this
import GamesModeration from './sections/admin/GamesModeration'; // Create this
import Conversations from './sections/general/Conversations';

const Playground = ({ setFooterVisibility }) => {
    const [activeSection, setActiveSection] = useState('Profile');
    const [gameId, setGameId] = useState(null);

    const { user } = useAuth();

    useEffect(() => {
        setFooterVisibility(false);
    }, [setFooterVisibility]);

    const sections = user.role === 'admin' ? [
        { name: 'Profile', emoji: '🧑' },
        { name: 'Users Moderation', emoji: '🛡️' },
        { name: 'Games Moderation', emoji: '🎯' },
    ] : [
        { name: 'Profile', emoji: '🧑' },
        { name: 'Games', emoji: '🎮' },
        { name: 'Tests', emoji: '🧪' },
        { name: 'Conversations', emoji: '💬' },
        { name: 'Achievements', emoji: '🏆' },
        { name: 'Leaderboards', emoji: '📊' },
    ];

    return (
        <div className="playground">
            <aside className="playground-sidebar">
                <h2>🕹️ Playground</h2>
                <ul className="sidebar-menu">
                    {sections.map(section => (
                        <li
                            key={section.name}
                            className={activeSection === section.name ? 'active' : ''}
                            onClick={() => setActiveSection(section.name)}
                        >
                            <span className="emoji">{section.emoji}</span>
                            <span className="text">{section.name}</span>
                        </li>
                    ))}
                </ul>
            </aside>

            <main className="playground-content">
                {activeSection === 'Profile' && (
                    user.role === 'teacher' ? <TeacherProfile setActiveSection={setActiveSection} />
                        : user.role === 'admin' ? <AdminProfile setActiveSection={setActiveSection} />
                            : <div>Student profile coming soon!</div>
                )}

                {activeSection === 'Games' && (
                    user.role === 'teacher' ? <TeacherGames setActiveSection={setActiveSection} />
                        : <StudentGames setActiveSection={setActiveSection} setGameId={setGameId} />
                )}

                {activeSection === 'CardGame' && (
                    user.role === 'teacher' ? <TeacherGames setActiveSection={setActiveSection} />
                        : <CardGame setActiveSection={setActiveSection} gameId={gameId} />
                )}

                {user.role === 'admin' && activeSection === 'Users Moderation' && (
                    <UsersModeration setActiveSection={setActiveSection} />
                )}

                {user.role === 'admin' && activeSection === 'Games Moderation' && (
                    <GamesModeration setActiveSection={setActiveSection} />
                )}

                {activeSection === 'Conversations' && (
                    <Conversations />
                )}
            </main>
        </div>
    );
};

export default Playground;
