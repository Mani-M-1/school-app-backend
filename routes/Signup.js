//first import the express
const express = require("express");
//define the router
 const router = express.Router();
//next mongoose is required
const mongoose = require("mongoose");
// const multer = require('multer');
//json webtoken for authguard for log in
const jwt = require('jsonwebtoken');

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
const UserSignup = require('../models/UserProfile');

//const UserProfile = require("../models/UserProfile");



//post method goes here
// upload.single('profileImage'),

router.post('/', (req, res, next)=>{
    const userSignup = new UserSignup({
      _id: new mongoose.Types.ObjectId,
      username: req.body.username,
      password: req.body.password,
      mobileNo: req.body.mobileNo,
      //address:  req.body.address,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      role: req.body.role,
      school: req.body.school,
      emergency: req.body.emergency,
      profile: req.body.profile
    });

     var username = req.body.username;

    //first check if user is alredy existed 
    UserSignup.findOne({username:username}).select().exec().then(doc =>{
      

  
     
    if(doc == null){

      userSignup.save()
      .then( result=> {
        res.status(200).json({
            message: "User signed up susccessfully",
            status:"success",
            Id: result._id,
            userData: result
        });
  
      }) 
      .catch(err => {
        res.status(500).json({
          error: err
        });
      })

    }else{
        res.status(200).json({
          message:"user already exists",
          status:"failed"
        })
    }
    
/*
       userSignup.save().then( result=> {
          res.status(200).json({
             message: "User signed up susccessfully",
             Id: result._id
          });
   })
   .catch(err => {
    console.log(err);
    res.status(500).json({
         error: err
          });
     })
*/

    });


});

// router.put('/:username', (req, res, next)=> {
//     const userId = req.params.id;
//     const update = {
//       _id: new mongoose.Types.ObjectId(),
//       school: req.body.school,
//       firstName: req.body.firstName,
//       lastName: req.body.lastName,
//       mobileNo: req.body.mobileNo,
//       emergency: req.body.emergency
      
//     };
//     UserProfile.findOneAndUpdate(
//       { "UserProfile._id": userId },
//       { $set: { "UserProfile.$": update } },
//       { new: true }
//     )
//     .select()
//     .exec()
//     .then(updatedDoc => {
//       if (updatedDoc) {
//         res.status(200).json({
//           message: "user updated successfully",
//           data: updatedDoc
//         });
//       } else {
//         res.status(404).json({
//           message: "user not found"
//         });
//       }
//     })
//     .catch(err => {
//       res.status(500).json({
//         message: "Failed to update user",
//         error: err
//       });
//     });
// })

 





//this is workig router not added json webtoken only
router.post('/login', async (req, res, next)=>{  // api modified by "manikanta" 
  try {
    const userDetails = await UserSignup.findOne({username: req.body.username});
  
      if(req.body.username == userDetails.username && req.body.password == userDetails.password){
        res.status(200).json({
          userData: userDetails,
          // added role for role based navigation
          role: userDetails.role,
          username: userDetails.username,
          school: userDetails.school,
          firstName: userDetails.firstName,
          lastName: userDetails.lastName,
          mobileNo: userDetails.mobileNo,
          emergency: userDetails.emergency,
          profile: userDetails.profile,
          message: "Success"
        })
      }
      else {
        res.status(404).json({message: "Failed to login please check username and password"});
      }
  }
  catch(err) {
    res.status(500).json({err_msg: "API Error occured while loging in"});
  }
});


// router.post('/login', (req, res, next) => {
//   const username = req.body.username;
//   const password = req.body.password;

//   UserSignup.findOne({ username: username }).select().exec().then(doc => {
//     if (!doc) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (password === doc.password) {
//       // User authentication successful
//       // Create a payload for the token with the necessary user information
//       const payload = {
//         userId: doc._id,
//         role: doc.role,
//         username: doc.username,
//         school: doc.school,
//         firstName: doc.firstName,
//         lastName: doc.lastName,
//         mobileNo: doc.mobileNo,
//         emergency: doc.emergency,
//       };

//       // Sign the payload with a secret key to generate the token
//       const secretKey = 'your_secret_key'; // Replace with your actual secret key
//       const options = {
//         expiresIn: '1h', // Token expiration time (e.g., 1 hour)
//       };

//       jwt.sign(payload, secretKey, options, (err, token) => {
//         if (err) {
//           return res.status(500).json({ message: "Failed to generate token" });
//         }

//         // Include the generated token in the response
//         res.status(200).json({
//           message: "Success",
//           token: token,
//           userData: {
//             // Send only necessary user information, excluding sensitive data
//             role: doc.role,
//             username: doc.username,
//             school: doc.school,
//             firstName: doc.firstName,
//             lastName: doc.lastName,
//             mobileNo: doc.mobileNo,
//             emergency: doc.emergency,
//           }
//         });
//       });
//     } else {
//       // Incorrect password
//       res.status(401).json({ message: "Authentication failed. Invalid username or password" });
//     }
//   }).catch(err => {
//     // Error handling if the database query fails
//     res.status(500).json({ message: "An error occurred" });
//   });
// });








//get user profile
router.get('/:username', (req, res, next) =>{
    UserSignup.findOne({username:req.params.username})
    .exec()
    .then(doc =>{
     
        res.status(200).json({
            userName: doc.username,
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
 
//  router.put('/:username', (req, res, next) => {
//     const username = req.params.username;
//     const updateFields = req.body; // Assuming the updated fields are sent in the request body
    
//     UserSignup.findOneAndUpdate({ username: username }, updateFields, { new: true })
//       .exec()
//       .then(updatedDoc => {
//         if (!updatedDoc) {
//           return res.status(404).json({
//             message: 'Profile not found'
//           });
//         }
        
//         res.status(200).json({
//           message: 'Profile updated successfully',
//           updatedProfile: updatedDoc,
//           school: updatedDoc.school,
//           firstName: updatedDoc.firstName,
//           lastName: updatedDoc.lastName,
//           mobileNo: updatedDoc.mobileNo,
//           emergency: updatedDoc.emergency,
//         });
//       })
//       .catch(err => {
//         console.error(err);
//         res.status(500).json({
//           error: err,
//           message: 'An error occurred while updating the profile'
//         });
//       });
//   });
  

// // Create a multer storage configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // Specify the destination folder for uploaded files
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname); // Set the filename for the uploaded file
//   }
// });

// Create a multer upload instance

// Update the PUT route to handle file uploads
router.put('/:username', (req, res, next) => {
  const username = req.params.username;
  const updateFields = req.body; // Assuming the updated fields are sent in the request body

  // Check if a file was uploaded
  if (req.file) {
    // Access the uploaded file using req.file
    const profileImage = req.file.path;
    // You can save the profileImage path to the database or perform any other operations here
    // updateFields.img = profileImage;
  }

  UserSignup.findOneAndUpdate({ username: username }, updateFields, { new: true })
    .exec()
    .then(updatedDoc => {
      if (!updatedDoc) {
        return res.status(404).json({
          message: 'Profile not found'
        });
      }

      res.status(200).json({
        message: 'Profile updated successfully',
        updatedProfile: updatedDoc,
        school: updatedDoc.school,
        firstName: updatedDoc.firstName,
        lastName: updatedDoc.lastName,
        mobileNo: updatedDoc.mobileNo,
        emergency: updatedDoc.emergency,
        profile: updatedDoc.profile
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



      
    

module.exports = router; 