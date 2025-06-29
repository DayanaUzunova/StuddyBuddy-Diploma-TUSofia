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
import CourseGames from './sections/teacher/CourseGames';
import Exam from './sections/teacher/Exam';

import StudentProfile from './sections/student/StudentProfile';
import Achievements from './sections/student/Achievements';
import { useSelector } from 'react-redux';
import { lang } from '../../lang/lang';

const Playground = ({ setFooterVisibility }) => {
    const [activeSection, setActiveSection] = useState('Profile');
    const [gameId, setGameId] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [examId, setExamId] = useState(null);

    const language = useSelector(state => state.general.language);

    const { user } = useAuth();

    useEffect(() => {
        setFooterVisibility(false);
    }, [setFooterVisibility]);

    let sections = [];

    if (user.role === 'student') {
        sections = [
            { name: 'Profile', emoji: '🧑' },
            { name: 'Courses', emoji: '📘' },
            { name: 'Conversations', emoji: '💬' },
            { name: 'Achievements', emoji: '🏆' },
        ];
    } else if (user.role === 'admin') {
        sections = [
            { name: 'Users Moderation', emoji: '🛡️' },
            { name: 'Games Moderation', emoji: '🎯' },
            { name: 'Exams Moderation', emoji: '📝' },
        ];
    } else if (user.role === 'teacher') {
        sections = [
            { name: 'Profile', emoji: '🧑' },
            { name: 'Conversations', emoji: '💬' },
        ];
    }

    return (
        <div className="playground">
            <aside className="playground-sidebar">
                <h2>🕹️ {lang(language, 'playground_title')}</h2>
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
                            : <StudentProfile />
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

                {user.role === 'student' && activeSection === 'Achievements' && (
                    <Achievements />
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
