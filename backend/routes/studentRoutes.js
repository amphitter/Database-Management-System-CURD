//backend/routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { verifyToken } = require('../middleware/authMiddleware');
const multer = require('multer');
const Student = require('../models/Student');

// ✅ Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// ✅ Student Routes

router.post('/', verifyToken, upload.single('image'), studentController.addStudent);
router.get('/', verifyToken, studentController.getStudents);
router.put('/:id', verifyToken, upload.single('image'), studentController.updateStudent);
router.delete('/:id', verifyToken, studentController.deleteStudent);
router.get('/registration/:registrationNumber', verifyToken, studentController.getStudentByRegistrationNumber);
router.post(
  "/:registrationNumber/payments",
  verifyToken,
  studentController.addPayment
);
// In studentRoutes.js
router.put(
  "/registration/:registrationNumber",
  verifyToken,
  upload.single("image"),
  studentController.updateStudentByRegistrationNumber
);
// ✅ Fetch student by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    if (!req.params.id || req.params.id.length !== 24) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
module.exports = router;
