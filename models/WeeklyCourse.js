

const mongoose = require('mongoose');

const CourseContentSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    week: { type:String },
    courseVideo: { type: String },
    videoLink: { type: String },
    pdf : { type: String },
    readingmeterial: { type: String },
    assignment: { type:String },
    additionalContent: { type: String },
    announcement: { type:String },
    startDate: { type: String },
    endDate: { type:String,  }
});

const WeeklyCourseSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    CourseName: {type:String, },
    ProfessorName : { type: String, },
    username: { type: String, },
    CourseDate : { type: String, },
    Coursetimings: { type: String, },
    Accessclass: { type: String, },
    Discription: { type: String, },
    CourseImage: { type: String },
    CourseContent:{ type:[CourseContentSchema], required: false }

});


module.exports = mongoose.model('WeeklyCourse', WeeklyCourseSchema);

