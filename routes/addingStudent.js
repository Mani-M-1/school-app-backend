const express = require('express');
// const multer = require('multer');
const router = express.Router();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
// const upload = multer({ dest: 'uploads/' }); // Define the destination folder for uploaded files
// Load the AWS SDK
const AWS = require('aws-sdk');
const fs =require('fs');
const fileRead= require('express-fileupload');
// var multer = require('multer');
var os = require('os');

// importing required models
const StudentModel = require('../models/addingStudent');  // Assuming your schema is in a separate file
const userProfile = require('../models/UserProfile');

// GET all student
router.get('/student', async (req, res) => {
    try {
      const Student = await StudentModel.find();
      res.json(Student);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET one student
router.get('/student/:id', async (req, res) => {
    try {
      const Student = await StudentModel.findById(req.params.id);
      if (Student) {
        res.json(Student);
      } else {
        res.status(404).json({ message: 'Student not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// // POST create a new student
// router.post('/student', (req, res, next) => {
//   // console.log(req.body);

 
//   const Student = new StudentModel(req.body) //this was written by "manikanta"
//     // const Student = new StudentModel({
//     //     _id: mongoose.Types.ObjectId(),
//     //     firstName: req.body.firstName,
//     //     lastName: req.body.lastName,
//     //     gender: req.body.gender,
//     //     yearOfStudy: req.body.yearOfStudy,
//     //     images: req.body.images,
//     //     group: req.body.group,
//     //     email: req.body.email,
//     //     password: req.body.password,
//     //     mobileNumber: req.body.mobileNumber,
//     //     address: req.body.address,
//     //     schoolname: req.body.schoolname,
//     //     schoolcode: req.body.schoolcode,
//     // });

//     Student
//     .save() 
//     .then(result => {
//       console.log(result)
//         res.status(201).json({
//             message: 'student created successfully',
//             createdStudent: {
//                 firstName: result.firstName,
//                 lastName: result.lastName,
//                 gender: result.gender,
//                 images: result.images,
//                 yearOfStudy: result.yearOfStudy,
//                 group: result.group,
//                 email: result.email,
//                 password: result.password,
//                 mobileNumber: result.mobileNumber,
//                 address: result.address,
//                 schoolname: result.schoolname,
//                 schoolcode: result.schoolcode,
//                 _id: result._id
//             }
//         });
//     })
//     .catch(error => {
//       console.log("error.message")
//       res.status(500).json({ error: error.message });
//   });
// });


//adding student {created by: "manikanta"}
router.post('/student', async (req, res) => {
  try {
    const student = new StudentModel(req.body) // adding student 
    await student.save();
    console.log(student)
    
    
    // creating student profile 
    const studentProfile = new userProfile({
      _id: new mongoose.Types.ObjectId(),
      username: req.body.email, // email is used for "username" field to create profile
      password: req.body.password,
      mobileNo: req.body.mobileNumber,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      role: "student",
      school: req.body.schoolname,
      emergency: req.body.mobileNumber,
    }) 
    
    // await studentProfile.save()
    // console.log(studentProfile)
    
    try {
      await studentProfile.save();
      console.log(studentProfile)
    } catch (err) {
      // Handle the error related to saving userProfile
      console.error("Error saving userProfile:", err);
      throw err; // Re-throw the error to be caught by the outer catch block
    }

    res.status(200).json({
      message: 'student created successfully',
      createdStudent: student,
      studentProfile
    })
  } catch (err) {
    res.status(500).json({err_msg: "An API Error occured while adding student"});
  }
})


// PUT update a student
// router.put('/student/:id', async (req, res) => {
//   try {
//     const Student = await StudentModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (Student) {
//       res.json({message: 'student updated'});
//     } else {
//       res.status(404).json({ message: 'student not found' });
//     }
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// PUT update student by ID
router.put('/student/:id', (req, res, next) => {
  const studentId = req.params.id;
// console.log(req.body);
  // Find the student by ID and update their information
  StudentModel.findByIdAndUpdate(studentId, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      gender: req.body.gender,
      yearOfStudy: req.body.yearOfStudy,
      images: req.body.images,
      group: req.body.group,
      email: req.body.email,
      password: req.body.password,
      mobileNumber: req.body.mobileNumber,
      address: req.body.address,
      schoolname: req.body.schoolname,
      schoolcode: req.body.schoolcode,
  }, { new: true }) // This option returns the updated document
  .then(updatedStudent => {
      if (!updatedStudent) {
          return res.status(404).json({ message: 'Student not found' });
      }
      res.status(200).json({
          message: 'Student updated successfully',
          updatedStudent: {
              _id: updatedStudent._id,
              firstName: updatedStudent.firstName,
              lastName: updatedStudent.lastName,
              gender: updatedStudent.gender,
              yearOfStudy: updatedStudent.yearOfStudy,
              images: updatedStudent.images,
              group: updatedStudent.group,
              email: updatedStudent.email,
              password: updatedStudent.password,
              mobileNumber: updatedStudent.mobileNumber,
              address: updatedStudent.address,
              schoolname: updatedStudent.schoolname,
              schoolcode: updatedStudent.schoolcode
          }
      });
  })
  .catch(error => {
      res.status(500).json({ error: error.message });
  });
});

// DELETE a student
router.delete('/student/:id', async (req, res) => {
  try {
    const Student = await StudentModel.findByIdAndDelete(req.params.id);
    if (Student) {
      res.json({ message: 'student deleted' });
    } else {
      res.status(404).json({ message: 'student not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search endpoint
router.get("/search/:key",async (req,res) => { 
  let data = await StudentModel.find(
      {
          "$or":[
              {firstName:{$regex:req.params.key}},
              {lastName:{$regex:req.params.key}}
          ]
      }
  )
  res.send(data)
});

// Create a POST route to send an email
router.post('/send-email', (req, res) => {
  const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
          user: "smartsquard1234@gmail.com",
          pass: "bdgnfmzfemlsmsob"
      }
  });

  const options = {
      from: "smartsquard1234@gmail.com",
      to: req.body.toEmail,
      subject: req.body.subject,
      text: req.body.text
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


// Add this code to your existing Express server setup

// // Reset Password API
// router.post('/reset-password/:token', async (req, res) => {
//   const { token } = req.params;
//   const { newPassword } = req.body;

//   try {
//     const user = await User.findOne({
//       resetToken: token,
//       resetTokenExpires: { $gt: Date.now() },
//     });

//     if (!user) {
//       return res.status(400).json({ message: 'Invalid or expired token' });
//     }

//     user.password = newPassword;
//     user.resetToken = null;
//     user.resetTokenExpires = null;
//     await user.save();

//     return res.status(200).json({ message: 'Password updated successfully' });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Server error' });
//   }
// });

// Update Password API
router.put('/update-password', async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
    const student = await StudentModel.findOne({ email });

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


//this for uploading files to s3 bucket
router.post('/uploadfiles', (req, res) => {
  
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


// // Replace with your user database or data structure
// const users = [
//   { id: 1, username: 'user1', status: 'active' },
//   { id: 2, username: 'user2', status: 'active' },
// ];

// Block a student
router.post('/block/:id', async (req, res) => {
  const { id } = req.params;
  // console.log(id)

  try {
    const student = await StudentModel.findByIdAndUpdate(
      id,
      { status: 'blocked' },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    return res.json({ message: 'Student blocked successfully', student });
  } catch (error) {
    // console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Unblock a student
router.post('/unblock/:id', async (req, res) => {
const { id } = req.params;

  try {
    const student = await StudentModel.findByIdAndUpdate(
      id,
      { status: 'active' },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    return res.json({ message: 'Student unblocked successfully', student });
  } catch (error) {
    // console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 