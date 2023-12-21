const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    CourseName: String,
    ProfessorName: String,
    CourseDiscription: String,
    CourseBook: String
    // isCompleted: Boolean => we should include this to know whether a user completed the course or not
});
module.exports = mongoose.model('Course', courseSchema);