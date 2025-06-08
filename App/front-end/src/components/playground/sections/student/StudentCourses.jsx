import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../../api/api';
import '../../../../style/studentCourses.css';

const StudentCourses = ({ setActiveSection, setSelectedCourse }) => {
    const [courses, setCourses] = useState([]);
    const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axiosInstance.get('/api/courses/all', { withCredentials: true });
                setCourses(res.data);
                const myIds = res.data
                    .filter(course => course.enrolled)
                    .map(course => course._id);
                setEnrolledCourseIds(myIds);
            } catch (err) {
                console.error('Failed to fetch courses:', err);
            }
        };
        fetchCourses();
    }, []);

    const handleEnroll = async (courseId) => {
        try {
            await axiosInstance.post(`/api/courses/${courseId}/enroll`, {}, { withCredentials: true });
            setEnrolledCourseIds(prev => [...prev, courseId]);
        } catch (err) {
            console.error('Failed to enroll:', err);
        }
    };

    const handleCourseClick = (course) => {
        if (enrolledCourseIds.includes(course._id)) {
            setSelectedCourse(course);
            setActiveSection('CourseGames');
        }
    };

    return (
        <div className="student-courses container">
            <section className="hero">
                <h1>📘 Available Courses</h1>
                <p>Click a course to view its games.</p>
            </section>

            <div className="course-grid">
                {courses.map(course => {
                    const isEnrolled = enrolledCourseIds.includes(course._id);

                    return (
                        <div
                            key={course._id}
                            className={`course-card ${isEnrolled ? 'clickable' : 'disabled'}`}
                            onClick={() => handleCourseClick(course)}
                        >
                            <h3>{course.title}</h3>
                            <p className="desc">{course.description}</p>

                            {isEnrolled ? (
                                <p className="enrolled-msg">✅ Enrolled</p>
                            ) : (
                                <button
                                    className="enroll-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEnroll(course._id);
                                    }}
                                >
                                    ➕ Enroll
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StudentCourses;
