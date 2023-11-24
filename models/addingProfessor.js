const mongoose = require('mongoose');

const ProfessorSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  gender: {
    type: String,
    enum: ["male", "female", "other"]
  },
  subjects: { type: String },
  images: {type: String},
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/, // Basic email format validation
  },
  password: { type: String, require:true},
  address: { type: String},
  schoolname: { type: String, require:true},
  schoolcode: { type: String, require:true},
  mobileNumber: {
    type: String,
    match: /^[0-9]{10}$/, // 10-digit mobile number validation
  },
  status: {type: String} //active or blocked
});

const ProfessorModel = mongoose.model('Professor', ProfessorSchema);

module.exports = ProfessorModel;