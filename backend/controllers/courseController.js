//backend/controllers/courseController.js
const Course = require('../models/Course');

exports.addCourse = async (req, res) => {
  try {
    console.log("Token payload:", req.user);
    const { title, description, fees } = req.body;
    // Use _id if your token contains _id instead of id
    const userId = req.user.id || req.user._id;
    const newCourse = new Course({ title, description, fees, userId });
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Error in addCourse:", error);
    res.status(500).json({ message: 'Server error', error });
  }
};



exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ userId: req.user.id });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


exports.updateCourse = async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: 'Error updating course' });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course' });
  }
};
