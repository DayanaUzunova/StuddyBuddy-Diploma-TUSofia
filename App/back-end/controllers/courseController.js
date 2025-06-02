const Course = require('../models/Course');

const createCourse = async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = req.user?.id;

        if (!title || !description || !userId) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        const newCourse = new Course({
            title,
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

        if (!title || !description || !Array.isArray(games)) {
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
        const courses = await Course.find()
            .populate('games')
            .populate('enrolledUsers')
            .sort({ createdAt: -1 });

        res.status(200).json(courses);
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

module.exports = {
    createCourse,
    getMyCourses,
    deleteCourse,
    editCourse,
    getAllCourses,
    getCourseById,
};
