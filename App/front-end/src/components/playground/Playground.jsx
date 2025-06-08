import React, { useEffect, useState } from 'react';
import '../../style/playground.css';
import { useAuth } from '../../context/AuthContext';

import TeacherGames from './sections/teacher/TeacherGames';
import StudentGames from './sections/student/StudentGames';
import TeacherProfile from './sections/teacher/TeacherProfile';
import CardGame from './sections/student/CardGame';

import AdminProfile from './sections/admin/AdminProfile';
import UsersModeration from './sections/admin/UsersModeration';
import GamesModeration from './sections/admin/GamesModeration';
import Conversations from './sections/general/Conversations';
import StudentCourses from './sections/student/StudentCourses';
import ExamsModeration from './sections/admin/ExamsModeration';
import CourseGames from './sections/teacher/CourseGames'
import Exam from './sections/teacher/Exam';

const Playground = ({ setFooterVisibility }) => {
    const [activeSection, setActiveSection] = useState('Profile');
    const [gameId, setGameId] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [examId, setExamId] = useState(null);

    const { user } = useAuth();

    useEffect(() => {
        setFooterVisibility(false);
    }, [setFooterVisibility]);

    let sections = [
        { name: 'Profile', emoji: '🧑' },
    ];

    if (user.role === 'student') {
        sections = sections.concat([
            { name: 'Courses', emoji: '📘' },
            { name: 'Conversations', emoji: '💬' },
            { name: 'Achievements', emoji: '🏆' },
            { name: 'Leaderboards', emoji: '📊' },
        ]);
    }
    else if (user.role === 'admin') {
        sections = sections.concat([
            { name: 'Users Moderation', emoji: '🛡️' },
            { name: 'Games Moderation', emoji: '🎯' },
            { name: 'Exams Moderation', emoji: '📝' },
        ]);
    }
    else if (user.role === 'teacher') {
        sections = sections.concat([
            { name: 'Conversations', emoji: '💬' },
            { name: 'Achievements', emoji: '🏆' },
        ]);
    };

    return (
        <div className="playground">
            <aside className="playground-sidebar">
                <h2>🕹️ Playground</h2>
                <ul className="sidebar-menu">
                    {sections.map(section => (
                        <li
                            key={section.name}
                            className={activeSection === section.name ? 'active' : ''}
                            onClick={() => {
                                setSelectedCourse(null); // reset course if navigating
                                setActiveSection(section.name);
                            }}
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
                    <CardGame setActiveSection={setActiveSection} gameId={gameId} />
                )}

                {activeSection === 'CourseGames' && selectedCourse && (
                    <CourseGames
                        course={selectedCourse}
                        setActiveSection={setActiveSection}
                        setGameId={setGameId}
                        setExamId={setExamId}
                        goBack={() => {
                            setSelectedCourse(null);
                            setActiveSection('Courses');
                        }}
                    />

                )}

                {user.role === 'admin' && activeSection === 'Users Moderation' && (
                    <UsersModeration setActiveSection={setActiveSection} />
                )}

                {user.role === 'admin' && activeSection === 'Games Moderation' && (
                    <GamesModeration setActiveSection={setActiveSection} />
                )}

                {activeSection === 'Conversations' && <Conversations />}

                {activeSection === 'Courses' && user.role === 'student' && (
                    <StudentCourses
                        setActiveSection={setActiveSection}
                        setSelectedCourse={setSelectedCourse}
                    />
                )}

                {user.role === 'admin' && activeSection === 'Exams Moderation' && (
                    <ExamsModeration setActiveSection={setActiveSection} />
                )}

                {activeSection === 'Exam' && examId && (
                    <Exam
                        examId={examId}
                        studentId={user._id}
                        onFinish={() => {
                            setActiveSection('Courses');
                            setExamId(null);
                        }}
                    />
                )}


            </main>
        </div>
    );
};

export default Playground;
