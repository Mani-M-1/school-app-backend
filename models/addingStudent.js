const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  //studentId: 
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  images: {type: String, require:true},
  yearOfStudy: { type: String, required: true },
  group: { type: String, required: true },
  email: {
    type: String,
    required: true,
    match: /^\S+@\S+\.\S+$/ // Basic email format validation
  },
  password: { type: String, require:true},
  address: { type: String, require:true},
  schoolname: { type: String, require:true},
  schoolcode: { type: String, require:true},
  mobileNumber: {
    type: Number,
    required: true,
    match: /^[0-9]{10}$/ // 10-digit mobile number validation
  },
  status: {type: String} //active or blocked
});

const StudentModel = mongoose.model('Student', StudentSchema);

module.exports = StudentModel;