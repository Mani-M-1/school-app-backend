//get the reuired libraries
const mongoose= require("mongoose");

// const subObj={
//     streetName:{type: String, required:false},
//     houseNo:{type: String, required: false},
//     city:{type: String, required:false},
//     state:{type: String, required:false},
//     zipCode:{type: String, required:false},
//     landMark:{type: String}


// } 

//define the schema here
const UserProfileSchema = mongoose.Schema({
   email: { type: String, required: true, unique: true }, //email
   password: { type: String, required: true },
   mobileNo: { type: Number, required: true},
   firstName:  {type:String, required: true},
   lastName:  {type:String, required: true}, 
   role: {type:String, required: true, enum: ['student', 'professor', 'principal']}, // "student", "professor" and "principal" 
   school: {type: String, required: true}, // school name
   emergency: { type: Number}, // phone number to call in case of emergency
   profile: { type: String }, // profile image
   yearOfStudy: { type: String }, // only for "student"
   group: { type: String }, // only for "student"
   gender: { type: String, enum: ['male', 'female', 'other'] },
   subjects: { type: String }, // only for "principal"
   schoolId: { type: String }, // (combination of "first letter of space seperated school name + 6 random digits ") generated while "principal" signup and this schoolId is assigned to students and professors (we should also send "schoolId" in email)
   address: { type: String },
   status: { type: String, enum: ["active", "inactive"] }, // active or blocked 
   enrolledCourses: [{CourseId: {type: String}, CourseDetails: {type: mongoose.Schema.ObjectId, ref: 'WeeklyCourse'}, CourseName: {type: String}, isChecked: {type: Boolean}, isCompleted: {type: Boolean}}], // only for students to show the "enrolled courses"
});


//export this mongoose module
module.exports = mongoose.model('UserProfile', UserProfileSchema);