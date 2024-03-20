const express = require('express');  
const router = express.Router();
const mongoose = require('mongoose');

//importing course enrollment "model"
// const courseEnrollment = require('../models/courseEnrollment');

//user profile import here
const UserSignup = require('../models/UserProfile');
const WeeklyCourse = require('../models/WeeklyCourse');

//post call to add course to the student profile
router.post('/enrollCourses', (req, res, next) => {
    console.log(req.body)

    //---------

     //find by the student Id and push the object to the student profile array
    UserSignup.updateOne({ _id: req.body.StudentId},
        { 
            $addToSet: { enrolledCourses: {CourseId: req.body.CourseId, CourseDetails: req.body.CourseId, CourseName: req.body.CourseName, isChecked: false, isCompleted: false}}}) // "isChecked" is used to represent the "checkboxes ticked" in ionic 
            .exec()
            .then(updatedData =>{
            res.status(200).json({
                message:"course added successfully",
                data: updatedData
            })
        }
    )

});



//remove the courses
router.post('/removeCourses', (req, res, next)=>{
    
    // const CourseEnroll = new courseEnrollment({
    //     CourseId: req.body.CourseId, 
    //     StudentId: req.body.StudentId 
    // })
    
    //Form a new Object here and push the object to the student profile Current courses data
    // console.log(CourseEnroll);
    //find by the student Id and push the object to the student profile array
    UserSignup.updateOne({ _id: req.body.StudentId},
        { $pull: { enrolledCourses: {CourseId: req.body.CourseId}}}).exec().then(updatedData =>{
            res.status(200).json({
                message:"course removed successfully",
                data: updatedData
            })
        })
    // UserSignup.find().select().exec().then(data=>{
    //     console.log(data);
    // })

});




//get User Profile Details {written by: "manikanta"}
router.get('/user-profile-details/:email', async (req, res) => {
    try {
        const userProfile = await UserSignup.findOne({email: req.params.email}).populate('enrolledCourses.CourseDetails');

        if (userProfile) {
            res.status(200).json({
                message: "User Profile Fetched Successfully",
                userProfile
            })
        }
        else {
            res.status(401).json({err_msg: "User Profile Doesn't Exist"})
        }
    }
    catch(err) {
        res.status(500).json({err_msg: "User Profile API Error"})
    }
})





// get students enrolled in a particular course 
router.get('/enrolled-students/:courseId', async(req, res) => {

    const course = await WeeklyCourse.findOne({_id: req.params.courseId});

    if (!course) {
        res.status(404).json({err_msg: "Course not found"});
    }

    try {

        const students = await UserSignup.find({ 'enrolledCourses.CourseId': req.params.courseId, role: "student" });

        res.status(200).json({message: "Students enrolled for the course are fetched successfully", students});
    }
    catch(err) {
        res.status(500).json({err_msg: "API Error occured while getting enrolled students", err_desc: err.message});
    }
})


// updating status of enrolled courses (Note: "only for professors");
router.put('/enrolled-students/student/change-course-status', async (req, res) => {
    console.log(req.body);
    const course = await WeeklyCourse.findById(req.body.courseId);

    if (!course) {
        res.status(404).json({err_msg: "Course not found"});
    }


    try {
        await UserSignup.updateOne(
            {
                _id: req.body.studentId,
                'enrolledCourses.CourseId': req.body.courseId
            },
            {
                $set: {'enrolledCourses.$.isCompleted': req.body.isCompleted, 'enrolledCourses.$.isChecked': req.body.isChecked}
            },
            {
                new: true
            } 
        )

        const updatedStudent = await UserSignup.findOne({_id: req.body.studentId});
        console.log(updatedStudent);

        res.status(200).json({message: "Course status updated successfully", updatedStudent});
    }
    catch(err) {
        res.status(500).json({err_msg: 'API Error occured while uodating the enrolled course status', err_desc: err.message});
    }
})


module.exports = router; 