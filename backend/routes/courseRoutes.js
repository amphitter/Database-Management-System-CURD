//backend/routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, courseController.addCourse);
router.get('/', verifyToken, courseController.getCourses);
router.put('/:id', verifyToken, courseController.updateCourse);
router.delete('/:id', verifyToken, courseController.deleteCourse);
router.get('/courses', async (req, res) => {
    const courses = await Course.find();
    res.json(courses);
  });
  
module.exports = router;
