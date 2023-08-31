const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    CourseName: String,
    ProfessorName: String,
    CourseDiscription: String,
    CourseBook: String
});
module.exports = mongoose.model('Course', courseSchema);