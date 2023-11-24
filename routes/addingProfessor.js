const express = require('express');  
const router = express.Router();
const mongoose = require('mongoose');
const ProfessorModel = require('../models/addingProfessor');
const nodemailer = require('nodemailer');


// GET all professors
router.get('/professors', async (req, res) => {
    try {
      const professors = await ProfessorModel.find();
      res.json(professors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // GET one professor
  router.get('/professors/:id', async (req, res) => {
    try {
      const professor = await ProfessorModel.findById(req.params.id);
      if (professor) {
        res.json(professor);
      } else {
        res.status(404).json({ message: 'Professor not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  

// POST create a new professor
router.post('/professors', (req, res, next) => {
    const professor = new ProfessorModel({
      _id: mongoose.Types.ObjectId(),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      gender: req.body.gender,
      subjects: req.body.subjects,
      images: req.body.images,
      email: req.body.email,
      password: req.body.password,
      mobileNumber: req.body.mobileNumber,
      address: req.body.address,
      schoolname: req.body.schoolname,
      schoolcode: req.body.schoolcode,
    });
  
    professor.save()
      .then(result => {
        res.status(201).json({
          message: 'Professor created successfully',
          createdProfessor: {
            firstName: result.firstName,
            lastName: result.lastName,
            gender: result.gender,
            subjects: result.subjects,
            images: result.images,
            email: result.email, // Include the timestamp in the response
            password: result.password,
            mobileNumber: result.mobileNumber,
            address: result.address,
            schoolname: req.body.schoolname,
            schoolcode: req.body.schoolcode,
            _id: result._id
          }
        });
      })
      .catch(error => {
        res.status(500).json({ error: error.message });
      });
  });
  
  // PUT update a professor
router.put('/professors/:id', async (req, res) => {
    try {
      const professor = await ProfessorModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (professor) {
        res.json({ message: 'professor updated'});
      } else {
        res.status(404).json({ message: 'Professor not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
   
  // DELETE a professor
  router.delete('/professors/:id', async (req, res) => {
    try {
      const professor = await ProfessorModel.findByIdAndDelete(req.params.id);
      if (professor) {
        res.json({ message: 'Professor deleted' });
      } else {
        res.status(404).json({ message: 'Professor not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Search endpoint
router.get("/search/:key",async (req,res) => { 
  let data = await ProfessorModel.find(
      {
          "$or":[
              {firstName:{$regex:req.params.key}},
              {lastName:{$regex:req.params.key}},
              {subjects:{$regex:req.params.key}}
          ]
      }
  )
  res.send(data)
});
//send email code
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

// Update Password API for professors
router.put('/update-password', async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
    const professor = await ProfessorModel.findOne({ email });

   console.log(professor)

    if (!professor) {
      return res.status(404).json({ message: 'Professor not found' });
    }
    console.log(professor)

    // Check if the current password matches
    if (professor.password !== currentPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update the professor's password
    professor.password = newPassword;
    await professor.save();

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

const filename= '/Users/rahul/Pictures/Screenshots/Screenshot (83).png';


const fileContent = fs.createReadStream(filename);
//console.log(fileContent);
const params = {
  Bucket: 'student-corner',
  Key:req.files.filename.name,
  Body: req.files.filename.data
}

s3.upload(params, (err, data) => {
  if (err) {
      console.log(err);
    reject(err)
  }
 
  res.send({"message":data.Location, "isSuccess": true})
  
})

//res.send('Hello World!');

})




// Block a student
router.post('/block/:id', async (req, res) => {
  const { id } = req.params;
  console.log(id)

  try {
    const professor = await ProfessorModel.findByIdAndUpdate(
      id,
      { status: 'blocked' },
      { new: true }
      );

      if (!professor) {
        return res.status(404).json({ error: 'Student not found' });
      }
  
      return res.json({ message: 'Student blocked successfully', professor });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

// Unblock a student
router.post('/unblock/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const professor = await ProfessorModel.findByIdAndUpdate(
      id,
      { status: 'active' },
      { new: true }
      );

      if (!professor) {
        return res.status(404).json({ error: 'Student not found' });
      }
  
      return res.json({ message: 'Student unblocked successfully', professor });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

module.exports = router;