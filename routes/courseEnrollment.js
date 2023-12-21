const express = require('express');  
const router = express.Router();
const mongoose = require('mongoose');

//importing course enrollment "model"
const courseEnrollment = require('../models/courseEnrollment');

//user profile import here
const UserSignup = require('../models/UserProfile');

//post call to add course to the student profile
router.post('/enrollCourses', (req, res, next) => {
    console.log(req.body)

    //---------

     //find by the student Id and push the object to the student profile array
    UserSignup.updateOne({ _id: req.body.StudentId},
        { 
            $addToSet: { enrolledCourses: {CourseId: req.body.CourseId, CourseName: req.body.CourseName, isCompleted: false}}}) // "isChecked" is used to represent the "checkboxes ticked" in ionic 
            .exec()
            .then(updatedData =>{
            res.status(200).json({
                message:"course added successfully",
                data: updatedData
            })
        }
    )

    // --------
    
    // const CourseEnroll = new courseEnrollment({
    //     CourseId: req.body.CourseId, //which course to add
    //     StudentId: req.body.StudentId
    // })
    
    //Form a new Object here and push the object to the student profile Current courses data
    // console.log(CourseEnroll);


   



    // UserSignup.find().select().exec().then(data=>{
    //     console.log(data);
    // })

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
router.get('/user-profile-details/:username', async (req, res) => {
    try {
        const userProfile = await UserSignup.findOne({username: req.params.username});

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




module.exports = router; 