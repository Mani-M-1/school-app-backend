//first import the express
const express = require("express");
//define the router
 const router = express.Router();
//next mongoose is required
const mongoose = require("mongoose");
// const multer = require('multer');
//json webtoken for authguard for log in
const jwt = require('jsonwebtoken');

const AWS = require('aws-sdk');
const fs =require('fs');
const fileRead= require('express-fileupload');
// var multer = require('multer');
var os = require('os');


// const storage = multer.diskStorage({
//   destination:function(req, file, cb) {
//     cb(null, './uploads/');
//   },
//   filename: function(req, file, cb){
//     cb(null, new Date().toISOString() + file.originalname);
//   }
// });
// console.log();
// const upload = multer({storage: storage});



//import the schema here
// const User = require('../models/UserProfile');
const UserProfile = require("../models/UserProfile");

//const UserProfile = require("../models/UserProfile");



//post method goes here
// upload.single('profileImage'),



function generateSchoolId(reqBody) {
  let schoolWordsStartingLetter;
  let schoolId;
  if (reqBody && reqBody.school) {
    if (reqBody.school.split(' ')) {
      let schoolWordsArr = reqBody.school.split(' ');
      
      // for getting starting letters of each word 
      schoolWordsStartingLetter = schoolWordsArr.map(eachWord => eachWord[0].toUpperCase());
      
    }else {
        let schoolWord= reqBody.school
        schoolWordsStartingLetter = schoolWord.slice(1, 0).toUpperCase();
    }

    const sixDigitNumber = Math.floor(Math.random() * 900000) + 100000;

    // for joining letters into schoolShortId 
    schoolId = schoolWordsStartingLetter.join('') + sixDigitNumber ;
  }
  
  return schoolId;
}



router.post('/signup', async (req, res, next)=>{
  // for creating array of words 
  console.log(req.body)
  // const schoolId = generateSchoolId(req.body);
  // console.log(schoolId)
  // console.log({...req.body, schoolId: schoolId})


  const user = await UserProfile.findOne({email: req.body.email});
  console.log(user)

  if (!user) {
    if (!req.body.schoolId && req.body.role === "principal") {
      const schoolId = generateSchoolId(req.body);
      const body = {...req.body, schoolId}

      try {
        const createdUser = new UserProfile(body); // only for "principal"
        await createdUser.save(); 
        res.status(200).json({message: "User created successfully!"});
      }
      catch(err) {
        res.status(500).json({err_msg: "API Error occured while creating user", err_desc: err.message})
      }
    }
    else {
      console.log("non principal code")
      try {
        const createdUser = new UserProfile(req.body); // for "students" and"professor
        const details = await createdUser.save(); 
        console.log(details)
        res.status(200).json({message: "User created successfully!"});
      }
      catch(err) {
        res.status(500).json({err_msg: "API Error occured while creating user", err_desc: err.message})
      }
    }


  }
  else {
    res.status(404).json({message: "User already exists!"});
  }


  // let user;

  // if (!req.body.schoolId && req.body.role === "principal") {
  //   const schoolId = generateSchoolId(req.body);
  //   console.log(schoolId)
  //   // user = new UserProfile({...req.body, schoolId: schoolId});
  // }
  
  
  
  
  
  // user = new UserProfile(req.body);





  // //first check if user is alredy existed 
  // UserProfile.findOne({email: req.body.email }).select().exec().then(doc =>{
    


    
  // if(doc == null){

  //   user.save()
  //   .then( result=> {
  //     res.status(200).json({
  //         message: "User signed up susccessfully",
  //         status:"success",
  //         Id: result._id,
  //         userData: result
  //     });

  //   }) 
  //   .catch(err => {
  //     res.status(500).json({
  //       error: err
  //     });
  //   })

  // }else{
  //     res.status(200).json({
  //       message:"user already exists",
  //       status:"failed"
  //     })
  // }


  // });


});







 





//this is workig router not added json webtoken only
router.post('/login', async (req, res, next)=>{  // api modified by "manikanta" 
  console.log(req.body)
  try {
    const userDetails = await UserProfile.findOne({email: req.body.email});
  
      if(req.body.email == userDetails.email && req.body.password == userDetails.password){
        res.status(200).json({
          userData: userDetails,
          message: "Success"
        })
      }
      else {
        res.status(404).json({message: "Failed to login please check email and password"});
      }
  }
  catch(err) {
    res.status(500).json({err_msg: "API Error occured while loging in"});
  }

});




// GET one user details using "userId"
router.get('/details/:userId', async (req, res) => {
  try {
    const user = await UserProfile.findOne({_id: req.params.userId});
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



//get user profile using "email"
router.get('/profile/:email', (req, res, next) =>{
    User.findOne({email:req.params.email})
    .exec()
    .then(doc =>{
     
        res.status(200).json({
            email: doc.email,
            FirstName: doc.firstName,
            lastName: doc.lastName,
            mobileno: doc.mobileNo,
            school: doc.school,
            emergency: doc.emergency,
            profile: doc.profile,
            data: doc

            //address: doc.address
           });
 
    })
    .catch(err =>{
        res.status(500).json({
          error: err,
          message:"profile Not Found"
        });
    });
 
     
 });






  
// Search endpoint for "students"
router.get("/student/search/:key/:schoolId",async (req,res) => { 
  // Use a regular expression for case-insensitive search

  try {

    const regex = new RegExp(req.params.key, 'i');
  
    let data = await UserProfile.find(
        {
            "$or":[
                {firstName: regex},
                {lastName: regex}
            ],
            role: "student",
            schoolId: req.params.schoolId
        }
    )
    res.send(data)
    console.log(regex);
    console.log(data);

  }
  catch(err) {
    res.status(500).json({message: 'API Error occured while filtering the students'})
  }
});




// Search endpoint for "professors"
router.get("/professor/search/:key/:schoolId",async (req,res) => { 
  // Use a regular expression for case-insensitive search
  const regex = new RegExp(req.params.key, 'i');

  let data = await UserProfile.find(
      {
          "$or":[
              {firstName:regex},
              {lastName:regex},
              {subjects:regex}
          ],
          role: 'professor',
          schoolId: req.params.schoolId
      }
  )
  res.send(data)
});




// get users on "role" and "school" this api is used on "principal" side to get all students or all professor who are of same school as "principal"
router.get('/same-school/:schoolId/:role', async (req, res) => {
  try {

    const Users = await UserProfile.find({role: req.params.role, schoolId: req.params.schoolId});
    res.json(Users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});











 

// Update the PUT route to handle updated using "email"
router.put('/profile/:email', (req, res, next) => {

  UserProfile.findOneAndUpdate({email: req.params.email}, req.body, { new: true })
    .exec()
    .then(updatedDoc => {
      if (!updatedDoc) {
        return res.status(404).json({
          message: 'Profile not found'
        });
      }

      res.status(200).json({
        message: 'Profile updated successfully',
        updatedProfile: updatedDoc
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: err,
        message: 'An error occurred while updating the profile'
      });
    });
});








// Update the PUT route to update using "uerId"
router.put('/profile/update/:userId', async (req, res, next) => {

  const user = await UserProfile.findOne({_id: req.params.userId});

  if (!user) {
    res.status(404).json({err_msg: "User not found"});
  }
  
  

  try {
    await UserProfile.updateOne({_id: req.params.userId}, req.body, {new: true});

    const userDetails = await UserProfile.findOne({_id: req.params.userId});
    res.status(200).json({message: "User updated successfully", updatedProfile: userDetails});
  }
  catch(err) {
    res.status({err_msg: "API Error occured while updating profile details", err_desc: err.message})
  }
});




//this for uploading files to s3 bucket
router.post('/profile/uploadfiles', (req, res) => {
  
  console.log(req.files.filename);
    

  const s3 = new AWS.S3({
    accessKeyId:"AKIAZ74FJQGL523L7WFP",
    secretAccessKey:"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"
  })

  //  const filename= '/Users/rahulrajput/Desktop/video/DJI_0030.MP4';

  // const filename= '/Users/rahul/Pictures/Screenshots/Screenshot (83).png';


  // const fileContent = fs.createReadStream(filename);
  //console.log(fileContent);
  const params = {
    Bucket: 'student-corner',
    Key:req.files.filename.name,
    Body: req.files.filename.data
  }


  s3.upload(params, (err, data) => {
    if (err) {
        // console.log(err);
      reject(err)
    }
  
    res.send({"message":data.Location, "isSuccess": true})
    
})

//res.send('Hello World!');

})


// Update Password API
router.put('/update-password', async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
    const student = await UserProfile.findOne({ email });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    // console.log(student)
    // Check if the current password matches
    if (student.password !== currentPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update the student's password
    student.password = newPassword;
    await student.save();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});
      


// Block a user
router.post('/block/:id', async (req, res) => {
  const { id } = req.params;

  const user = await UserProfile.findOne({_id: id});

  if (!user) {
    res.status(404).json({error: "User not found"});
  }

  try {
    const user = await UserProfile.findByIdAndUpdate(
      id,
      { status: 'blocked' },
      { new: true }
    );

    return res.json({ message: 'User blocked successfully', user });
  } catch (error) {
    // console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Unblock a user
router.post('/unblock/:userId', async (req, res) => {
const { userId } = req.params;

  const user = await UserProfile.findOne({_id: userId});

  if (!user) {
    res.status(404).json({error: "User not found"});
  }

  try {
    const user = await UserProfile.findByIdAndUpdate(
      userId,
      { status: 'active' },
      { new: true }
    );

    return res.json({ message: 'User unblocked successfully', user });
  } catch (error) {
    // console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
    




// DELETE a user
router.delete('/profile/:id', async (req, res) => {
  try {
    const user = await UserProfile.findByIdAndDelete(req.params.id);
    if (user) {
      res.json({ message: 'User deleted successfully!' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



















// Create a POST route to send an email
router.post('/send-email', (req, res) => {
  // console.log(req.body)

  let user = req.body.email.split("@")[0] 

  const output = `
        <h3>Hi ${user}</h3>
        <p> You have a request from ssdsorg@gmail.com through School Corner App</p>
        <h4>Your Details are given below </h4>
        <ul style="padding: 0;"> 
          <li style="list-style: none;"> Email: ${req.body.email} </li>
          <li style="list-style: none;"> Password: ${req.body.password} </li>
        </ul>
        <p> Please click <a href='${process.env.FRONTEND_URL}/signin'>here</a> to enter the School Corner application</p> 
  `
  const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
          user: "ssdsorg@gmail.com",
          pass: "lzhvxwjwxljznhed"
          // user: "smartsquard1234@gmail.com",
          // pass: "bdgnfmzfemlsmsob"
      }
  });

  const options = {
      from: "ssdsorg@gmail.com",
      to: req.body.email,
      subject: "Your Credentials!",
      text: "Hello World!",
      html : output
  };

  transporter.sendMail(options, (err, info) => {
      if (err) {
          console.log(err);
          res.status(500).json({ error: 'An error occurred while sending the email.' });
      } else {
          console.log("Email sent: " + info.response);
          res.json({ message: 'Email sent successfully.' });
      }
  });
});









module.exports = router; 