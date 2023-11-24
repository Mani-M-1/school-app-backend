const mongoose = require('mongoose');

const courseEnrollment = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    CourseId: String, //which course to add
    StudentId: String  //which student to add

});
module.exports = mongoose.model('Course', courseEnrollment);