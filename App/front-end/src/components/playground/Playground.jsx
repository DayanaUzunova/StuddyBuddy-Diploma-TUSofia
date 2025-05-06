import React, { useEffect, useState } from 'react';
import '../../style/playground.css';

const Playground = ({ setFooterVisibility }) => {
    const [activeSection, setActiveSection] = useState('Profile');

    const sections = [
        { name: 'Profile', emoji: '🧑' },
        { name: 'Games', emoji: '🎮' },
        { name: 'Tests', emoji: '🧪' },
        { name: 'Conversations', emoji: '💬' },
        { name: 'Achievements', emoji: '🏆' },
        { name: 'Leaderboards', emoji: '📊' },
    ];

    useEffect(() => {
        setFooterVisibility(false);
    }, [setFooterVisibility]);

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
                <h1>
                    {sections.find(s => s.name === activeSection)?.emoji} {activeSection}
                </h1>
                <p>
                    This is the <strong>{activeSection}</strong> section.
                </p>
            </main>
        </div>
    );
};

export default Playground;