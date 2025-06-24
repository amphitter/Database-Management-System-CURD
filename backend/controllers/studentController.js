// backend/controllers/studentController.js
const Student = require('../models/Student');

// ✅ Add Student
exports.addStudent = async (req, res) => {
  try {
    const newStudent = new Student({
      name: req.body.name,
      fatherName: req.body.fatherName,
      dateOfBirth: req.body.dateOfBirth,
      gender: req.body.gender,
      contact: req.body.contact,
      qualification: req.body.qualification,
      registrationNumber: req.body.registrationNumber,
      modeOfPayment: req.body.modeOfPayment,
      courseTitle: req.body.courseTitle,
      fees: req.body.fees,
      feesStatus: req.body.feesStatus,
      imageUrl: req.file ? req.file.path : null,
      address: req.body.address,
      email: req.body.email,
    });
    await newStudent.save();
    res.status(201).json({ message: 'Student added successfully', student: newStudent });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ message: 'Error adding student', error: error.message });
  }
};

// ✅ Get All Students
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students' });
  }
};

// backend/controllers/studentController.js
exports.getStudentByRegistrationNumber = async (req, res) => {
  try {
    const { registrationNumber } = req.params;

    // Log the registration number for debugging
    console.log("Fetching student with registration number:", registrationNumber);

    // Case-insensitive search
    const student = await Student.findOne({
      registrationNumber: { $regex: new RegExp(`^${registrationNumber}$`, "i") },
    });

    if (!student) {
      console.log("Student not found in the database");
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ message: "Error fetching student", error: error.message });
  }
};

// ✅ Update Student
exports.updateStudent = async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { ...req.body, imageUrl: req.file ? req.file.path : undefined },
      { new: true }
    );
    if (!updatedStudent) return res.status(404).json({ message: 'Student not found' });

    res.json({ message: 'Student updated successfully', student: updatedStudent });
  } catch (error) {
    res.status(500).json({ message: 'Error updating student' });
  }
};

exports.updateStudentByRegistrationNumber = async (req, res) => {
  try {
    const { registrationNumber } = req.params;

    // Log the registration number for debugging
    console.log("Updating student with registration number:", registrationNumber);

    // Find and update the student
    const updatedStudent = await Student.findOneAndUpdate(
      { registrationNumber: { $regex: new RegExp(`^${registrationNumber}$`, "i") } },
      { ...req.body, imageUrl: req.file ? req.file.path : undefined },
      { new: true }
    );

    if (!updatedStudent) {
      console.log("Student not found in the database");
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student updated successfully", student: updatedStudent });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ message: "Error updating student", error: error.message });
  }
};

// backend/controllers/studentController.js
exports.addPayment = async (req, res) => {
  try {
    const { registrationNumber } = req.params;
    const paymentData = {
      ...req.body,
      fromDate: new Date(req.body.fromDate),
      toDate: new Date(req.body.toDate)
    };

    const student = await Student.findOneAndUpdate(
      { registrationNumber },
      { $push: { payments: paymentData } },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ 
      message: 'Payment added successfully', 
      student 
    });
  } catch (error) {
    console.error('Error adding payment:', error);
    res.status(500).json({ 
      message: error.message || 'Error adding payment' 
    });
  }
};

// ✅ Delete Student
exports.deleteStudent = async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) return res.status(404).json({ message: 'Student not found' });

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student' });
  }
};
