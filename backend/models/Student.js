// backend/models/Student.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  month: { type: String, required: true },
  method: { type: String, enum: ['Cash', 'Cashless'], required: true },
  modeDetails: String,
  transactionId: String
});

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },
  fatherName: { type: String, required: [true, "Father's name is required"] },
  dateOfBirth: { 
    type: Date, 
    required: [true, 'Date of birth is required'],
    get: (date) => date.toISOString().split('T')[0]
  },
  gender: { 
    type: String, 
    enum: ['Male', 'Female', 'Other'],
    required: [true, 'Gender is required']
  },
  contact: { 
    type: String, 
    required: [true, 'Contact number is required'],
    validate: {
      validator: (v) => /^[0-9]{10}$/.test(v),
      message: 'Invalid contact number'
    }
  },
  qualification: { type: String, required: [true, 'Qualification is required'] },
  registrationNumber: { 
    type: String, 
    unique: true,
    required: [true, 'Registration number is required']
  },
  courseTitle: { type: String, required: [true, 'Course title is required'] },
  fees: { 
    type: Number, 
    required: [true, 'Fees amount is required'],
    min: [0, 'Fees cannot be negative']
  },
  payments: [paymentSchema],
  imageUrl: { type: String },
  email: { 
    type: String,
    validate: {
      validator: (v) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v),
      message: 'Invalid email address'
    }
  },
  address: { type: String, required: [true, 'Address is required'] },
  admissionDate: { type: Date, default: Date.now }
}, { toJSON: { getters: true } });

// Virtual for fee status
StudentSchema.virtual('feesStatus').get(function() {
  if (!this.payments || this.payments.length === 0) return 'Unpaid';
  const lastPayment = this.payments[this.payments.length - 1];
  return new Date(lastPayment.toDate) > new Date() ? 'Paid' : 'Unpaid';
});

module.exports = mongoose.model('Student', StudentSchema);