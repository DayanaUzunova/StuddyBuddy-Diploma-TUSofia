const Course = require('../models/Course');

const createCourse = async (req, res) => {
    try {
        const { title, description, subject } = req.body;
        const userId = req.user?.id;

        if (!title || !description || !userId) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        const existingCourse = await Course.findOne({ title, createdBy: userId });
        if (existingCourse) {
            return res.status(409).json({ message: 'Course with this title already exists.' });
        }

        const newCourse = new Course({
            title,
            subject,
            description,
            createdBy: userId,
            games: [],
            enrolledUsers: [],
        });

        const savedCourse = await newCourse.save();
        res.status(201).json(savedCourse);
    } catch (err) {
        console.error('Error creating course:', err);
        res.status(500).json({ message: 'Server error while creating course.' });
    }
};

const getMyCourses = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new Error('Invalid user ID in getMyCourses!');
        }

        const courses = await Course.find({ createdBy: userId })
            .populate('games')
            .populate('enrolledUsers');

        res.status(200).json(courses);
    } catch (err) {
        console.error('Error fetching courses:', err);
        res.status(500).json({ message: err.message || 'Server error' });
    }
};

const deleteCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        if (!courseId) {
            throw new Error('Invalid course ID!');
        }

        const deleted = await Course.findByIdAndDelete(courseId);

        if (!deleted) {
            throw new Error('Course not found!');
        }

        res.status(200).json({ message: 'Course deleted successfully.' });
    } catch (err) {
        console.error('Error deleting course:', err);
        res.status(500).json({ message: err.message || 'Failed to delete course.' });
    }
};

const editCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, games } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: 'Missing or invalid course data.' });
        }

        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        if (course.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to edit this course.' });
        }

        course.title = title;
        course.description = description;
        course.games = games;

        const updated = await course.save();
        res.status(200).json(updated);
    } catch (err) {
        console.error('Error editing course:', err);
        res.status(500).json({ message: 'Failed to update course.' });
    }
};

const getAllCourses = async (req, res) => {
    try {
        const userId = req.user?.id;

        const courses = await Course.find()
            .populate('games')
            .populate('enrolledUsers')
            .sort({ createdAt: -1 });

        const enrichedCourses = courses.map(course => {
            const isEnrolled = course.enrolledUsers.some(user => user._id.toString() === userId);
            return { ...course.toObject(), enrolled: isEnrolled };
        });

        res.status(200).json(enrichedCourses);
    } catch (err) {
        console.error('Error fetching all courses:', err);
        res.status(500).json({ message: 'Server error while fetching courses.' });
    }
};

const getCourseById = async (req, res) => {
    try {
        const courseId = req.params.id;

        if (!courseId) {
            return res.status(400).json({ message: 'Invalid or missing course ID.' });
        }

        const course = await Course.findById(courseId)
            .populate('games')
            .populate('enrolledUsers');

        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        res.status(200).json(course);
    } catch (err) {
        console.error('Error fetching course:', err);
        res.status(500).json({ message: 'Server error while fetching course.' });
    }
};

const enrollInCourse = async (req, res) => {
    try {
        const userId = req.user?.id;
        const courseId = req.params.id;

        if (!userId || !courseId) {
            return res.status(400).json({ message: 'Missing user or course ID' });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (!course.enrolledUsers.includes(userId)) {
            course.enrolledUsers.push(userId);
            await course.save();
        }

        res.status(200).json({ message: 'Successfully enrolled in course' });
    } catch (err) {
        console.error('Enrollment error:', err);
        res.status(500).json({ message: 'Failed to enroll in course' });
    }
};

const getEnrolledUsers = async (req, res) => {
    try {
        const courseId = req.params.id;

        if (!courseId) {
            return res.status(400).json({ message: 'Missing course ID' });
        }

        const course = await Course.findById(courseId).populate('enrolledUsers');
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(200).json(course.enrolledUsers);
    } catch (err) {
        console.error('Error fetching enrolled users:', err);
        res.status(500).json({ message: 'Server error while fetching enrolled users.' });
    }
};

const getEnrolledCoursesbyStudnet = async (req, res) => {
    try {
        const userId = req.user.id;

        const courses = await Course.find({ enrolledUsers: userId })
            .populate('games')
            .populate('exams');

        res.json(courses);
    } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        res.status(500).json({ error: 'Server error fetching enrolled courses' });
    }
}

module.exports = {
    createCourse,
    getMyCourses,
    deleteCourse,
    editCourse,
    getAllCourses,
    getCourseById,
    enrollInCourse,
    getEnrolledUsers,
    getEnrolledCoursesbyStudnet
};
