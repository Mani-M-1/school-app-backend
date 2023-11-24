const express = require('express');  
const router = express.Router();
const mongoose = require('mongoose');
const courseEnrollment = require('../models/courseEnrollment');

//user profile import here
const UserSignup = require('../models/UserProfile');

//post call to add course to the student profile
router.post('/enrollCourses', (req, res, next)=>{
    
    CourseEnroll = new courseEnrollment({
        CourseId: req.body.CourseId, //which course to add
        StudentId: req.body.StudentId
    })
    
    //Form a new Object here and push the object to the student profile Current courses data
    console.log(CourseEnroll);
    //find by the student Id and push the object to the student profile array
    UserSignup.updateOne({ _id: req.body.StudentId},
        { $addToSet: { currentCourses: req.body.CourseId}}).exec().then(updatedData =>{
            res.status(200).json({
                message:"courese added successfully",
                data: updatedData
            })
        })
    // UserSignup.find().select().exec().then(data=>{
    //     console.log(data);
    // })

});



//remove the courses
router.post('/removeCourses', (req, res, next)=>{
    
    CourseEnroll = new courseEnrollment({
        CourseId: req.body.CourseId, //which course to add
        StudentId: req.body.StudentId 
    })
    
    //Form a new Object here and push the object to the student profile Current courses data
    console.log(CourseEnroll);
    //find by the student Id and push the object to the student profile array
    UserSignup.updateOne({ _id: req.body.StudentId},
        { $pull: { currentCourses: req.body.CourseId}}).exec().then(updatedData =>{
            res.status(200).json({
                message:"courese added successfully",
                data: updatedData
            })
        })
    // UserSignup.find().select().exec().then(data=>{
    //     console.log(data);
    // })

});



//move to complete course





module.exports = router; 