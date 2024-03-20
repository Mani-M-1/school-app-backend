const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
// const { v4: uuidv4 } = require('uuid');
// const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');





//importing schema from models folder
const WeeklyCourse = require('../models/WeeklyCourse');

// const onesignalInitialization = require('../onesignalInitialization');



//const upload = multer({ dest: '../uploads/' });


//creating "upload" variable for exicuting multer

const storage = multer.diskStorage({
  destination: function(req, file, cb){
      cb(null, '../uploads/');
  },
  filename: function(req, file, cb){
      cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || 
  file.mimetype === 'image/PNG'){
      cb(null, true);
  }else{
      cb(null, false);
  }
};

const upload = multer({storage: storage, 
  limits: {
  filesize: 1024 * 1024 * 5
},
 // fileFilter : fileFilter
}); //creating "upload" variable for exicuting multer

// defining required variables

// const bucketName = process.env.AWS_BUCKET_NAME;
// const region = process.env.AWS_BUCKET_REGION;
// const accessKeyId = process.env.AWS_ACCESS_KEY;
// const secretAccessKey = process.env.AWS_SECRET_KEY;

// const s3 = new S3Client({
//   region,
//   credentials: {
//     accessKeyId,
//     secretAccessKey
//   }
// });

// //// Define the uploadFile function
// const uploadFile = async (file) => {
//     const fileStream = fs.createReadStream(file.path);
//     const fileName = `${uuidv4()}-${file.filename}`; // Generate a unique filename
  
//     const uploadParams = {
//       Bucket: bucketName,
//       Body: fileStream,
//       Key: fileName
//     };
  
//     try {
//       const command = new PutObjectCommand(uploadParams);
//       const response = await s3.send(command);
//       return fileName; // Return the generated filename
//     } catch (error) {
//       console.error(error);
//       throw error;
//     }
//   }




// async function sendNotificationAfterAddingCourse({professorName, email, profile}) {
//   const {client, notification} = onesignalInitialization(); // getting "client" & "notification" from the "onesignalInitialization()" function
  
//   notification.include_external_user_ids = req.body.externalIdsArr; // providing multiple "subscription id's" in an array 
//   notification.headings = { en: "School App" }; // notification heading 
//   notification.contents = { en: `${professorName} added a new weekly course, please checkout`}; // notification content
//   notification.data = {
//     email: email,
//     profile: profile
//   }

//   try {
//     const response = await client.createNotification(notification);
//     res.json(response);
//   } 
//   catch (error) {
//     console.error('Error sending notification:', error);

//     if (error.body && error.body.errors && error.body.errors.length > 0) {
//     console.error('OneSignal Error:', error.body.errors[0].message);
//     }

//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }






//get all weekly courses
router.get('/:schoolId', (req, res, next) => {
   WeeklyCourse.find({schoolId: req.params.schoolId})
    .exec()
    .then( docs => {
        // console.log(docs);
        res.status(200).json(docs);
    })
    .catch(err => {
        // console.log(err);
        res.status(500).json({
            error: err
        });
    });
});


//get all weekly courses by professor
router.get('/professor/:email', (req, res, next) => {
  WeeklyCourse.find({email: req.params.email})
   .exec()
   .then( docs => {
      //  console.log(docs);
       res.status(200).json(docs);
   })
   .catch(err => {
      //  console.log(err);
       res.status(500).json({
           error: err
       });
   });
});

// Search api
router.get("/search/:key",async (req,res) => { 
  let data = await WeeklyCourse.find(
      {
          "$or":[
              {CourseName:{$regex:req.params.key}},
              {ProfessorName:{$regex:req.params.key}}
          ]
      }
  )
  res.send(data)
});
// upload.single('CourseImage'
// weekly course API
router.post('/', async (req, res, next) => {
 // console.log(req.CourseImage);
  //res.send('File uploaded successfully!');
  // console.log(req.body.CourseContent);
  // console.log(JSON.stringify(req.body) + "this is req.body incomming");
  try {
    var CourseContentdata = { 
      _id: new mongoose.Types.ObjectId(),
      week : req.body.CourseContent.week,
      courseVideo : req.body.CourseContent.courseVideo,
      videoLink: req.body.CourseContent.videoLink,
      pdf : req.body.CourseContent.pdf,
      readingmeterial: req.body.CourseContent.readingmeterial,
      assignment: req.body.CourseContent.assignment,
      additionalContent: req.body.CourseContent.additionalContent,
      announcement: req.body.CourseContent.announcement,
      startDate: req.body.CourseContent.startDate,
      endDate: req.body.CourseContent.endDate
      
      }
    //const uploadedFileName = await uploadFile(req.file); // Call the modified uploadFile() function
    const w_course = new WeeklyCourse({
      _id: new mongoose.Types.ObjectId(),
      CourseName: req.body.CourseName,
      ProfessorName: req.body.ProfessorName,
      email: req.body.email,
      CourseDate: req.body.CourseDate,
      Coursetimings: req.body.Coursetimings,
      Accessclass: req.body.Accessclass,
      Discription: req.body.Discription,
      CourseImage: req.body.CourseImage, // Use the uploaded file name
      CourseContent: CourseContentdata,
      schoolId: req.body.schoolId
    });

    w_course.save()
      .then(result => {
        // console.log(result + "this is the result");
        res.status(201).json({
          message: 'Handling POST requests to /Weeklycourse',
          courseCreated: result
        });

        // invoking the sendNotificationAfterAddingCourse function to send notifications to all the students of the same school as professor
        // sendNotificationAfterAddingCourse({professorName: req.body.ProfessorName, email: req.body.NotificationDetails.email, profile: req.body.NotificationDetails.profile})
      })
      
      .catch(err => {
        // console.log(err);
        res.status(500).json({
          error: err
        });
      });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      error: 'Failed to upload image'
    });
  }
});



// working post router
// router.post('/', (req, res, next) => {
//     const w_course = new WeeklyCourse({
//         _id: new mongoose.Types.ObjectId(),
//         CourseName: req.body.CourseName,
//         ProfessorName: req.body.ProfessorName,
//         CourseDate: req.body.CourseDate,
//         Coursetimings: req.body.Coursetimings,
//         Accessclass: req.body.Accessclass,
//         Discription: req.body.Discription,
//         CourseImage: req.body.CourseImage,
//         CourseContent: req.body.CourseContent

//     });
//     w_course
//         .save()
//         .then(result => {
//             console.log(result);
//             res.status(201).json({
//                 massage: 'Handling POST requests to /Weeklycourse',
//                 courseCreated: result
//             });
//         })
//         .catch(err => {
//              console.log(err);
//              res.status(500).json({
//                 error: err
//              });
//         })
// });

//api to add new weekly course

router.post('/addWeek', (req, res, next) =>{
  // console.log(req.body.week);
    const addWeek = {
        _id: new mongoose.Types.ObjectId(),
        week: req.body.week,
        courseVideo: req.body.courseVideo,
        vodeoLink: req.body.vodeoLink,
        pdf: req.body.pdf,
        readingmeterial: req.body.readingmeterial,
        assignment: req.body.assignment,
        additionalContent: req.body.additionalContent,
        announcement: req.body.announcement,
        startDate: req.body.startDate,
        endDate: req.body.endDate

        
    }
    // console.log(req.body.week);
    //form the query to push new into existing data
    var query = {$push: {CourseContent: addWeek}}
    // console.log(req.body._id);
    // console.log(addWeek)
    //now find exiting course by it's doucument Id and push the data

    WeeklyCourse.findByIdAndUpdate({_id: req.body._id}, query)
    .select()
    .exec()
    .then(doc => {//console.log(doc)
        if (doc){
            res.status(200).json({
                massage: "success",
                data: doc
            })
        }else{
            res.status(200).json({
                massage:"no matching docs found"
            })
        }
    })
    .catch(err=>{
        res.status(420).json({
            massage: "failed",
            error: err
        })
    })
});



//update onli weekly course by ID

// router.patch('/updateOnlyWeek/:w_courseId/:weekId',(req, res, next) => {
//     const id = req.params.w_courseId;
//     const weekId = req.params.weekId;

//     const updateOps = {};
//     for (const ops of req.body) {
//      updateOps[ops.propName] = ops.value;
//     }
//     // WeeklyCourse.updateMany({_id:'642aa89548ad434bdbe0c4e4','CourseContent._id':'642aa89548ad434bdbe0c4e5'} , { $set: updateOps }) 

//     WeeklyCourse.updateMany({_id: id,'CourseContent._id':weekId} , { $set: updateOps }) 
//      .exec()
//      .then( result => {
//          console.log(result);
//          res.status(200).json(result);
//      })
//      .catch(err => {
//          console.log(err);
//          res.status(500).json({
//              error: err
//          });
//      });
 
//  });


//put method is working

router.put('/updateWeeklyCourse/:weeklyId', (req, res, next) => { // modified by "manikanta"
    const {weeklyId} = req.params;


  
    // const update = {
    //   week: req.body.week,
    //   courseVideo: req.body.courseVideo,
    //   videoLink: req.body.videoLink,
    //   pdf: req.body.pdf,
    //   readingmeterial: req.body.readingmeterial,
    //   assignment: req.body.assignment,
    //   additionalContent: req.body.additionalContent,
    //   announcement: req.body.announcement,
    //   startDate: req.body.startDate,
    //   endDate: req.body.endDate
    // };
    WeeklyCourse.updateOne(
      { "CourseContent._id": weeklyId },
      // { $set: { "CourseContent.$": update } },
      { $set: { "CourseContent.$": req.body } }, // written by "manikanta"
      { new: true }
    )
    // .select()
    .exec()
    .then(updatedDoc => {
      if (updatedDoc) {
        res.status(200).json({
          message: "Week updated successfully",
          data: updatedDoc
        });
      } else {
        res.status(404).json({
          message: "Week not found"
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: "Failed to update week",
        error: err
      });
    });
  });
 //this is working 
// router.delete('/deleteWeek/:weekId', (req, res, next) => {
//     const { weekId } = req.params;
  
//     WeeklyCourse.updateOne(
//       { "CourseContent._id": weekId },
//       { $pull: { CourseContent: { _id: weekId } } },
//       { new: true }
//     )
//       .exec()
//       .then((doc) => {
//         if (doc) {
//           res.status(200).json({
//             message: 'Weekly Course deleted successfully',
//             data: doc,
//           });
//         } else {
//           res.status(404).json({
//             message: 'Weekly Course not found',
//           });
//         }
//       })
//       .catch((err) => {
//         console.error(err);
//         res.status(500).json({
//           message: 'Server Error',
//           error: err,
//         });
//       });
//   });

router.delete('/deleteWeeklyCourse/:weekId/:courseId', (req, res, next) => {
  const  {weekId, courseId} = req.params;
  // console.log(weekId, courseId)
  // const convertedId = new mongoose.Types.ObjectId(weekId);

  WeeklyCourse.updateOne(
    { _id: courseId },  // modified by "manikanta"
    { $pull: { CourseContent: { _id: weekId } } },
    { new: true }
  )
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          message: 'Weekly Course deleted successfully',
          data: doc,
        });
      } else {
        res.status(404).json({
          message: 'Weekly Course not found',
        });
      }
    })
    .catch((err) => {
      // console.error(err);
      res.status(500).json({
        message: 'Server Error',
        error: err,
      });
    });
});
  
  //to get single course with ID
router.get('/getCourse/:w_courseId',(req, res, next) => {
  const id = req.params.w_courseId;
  console.log(id)
   WeeklyCourse.findById(id)
    .exec()
    .then(doc => {
        // console.log("From database", doc);
        if (doc) {
            res.status(200).json(doc);
        } else {
            res.status(404).json({massage: 'No valid entry found for given ID'});
        }
    })
    .catch(err => {
        // console.log(err);
        res.status(500).json({error: err});
    });
});    
 
router.patch('/updateCourse/:w_courseId',(req, res, next) => {
   const id = req.params.w_courseId;
   const updateOps = {};
   for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
   }
   WeeklyCourse.updateMany({ _id: id }, { $set: updateOps }) 
    .exec()
    .then( result => {
        // console.log(result);
        res.status(200).json(result);
    })
    .catch(err => {
        // console.log(err);
        res.status(500).json({
            error: err
        });
    });

});

router.delete('/deleteCourse/:w_courseId',(req, res, next) => {
    const id = req.params.w_courseId;
    WeeklyCourse.deleteOne({ _id: id })
        .exec()
        .then( result => {
            res.status(200).json({massage: "Course deleted"});
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


//image upload

router.post('/Uploadfile', (req, res) => {
  
  // console.log("upload file triggered")
    // console.log(req.files.filename);
    // console.log(req.files.filename.name)
  
  const s3 = new AWS.S3({
    accessKeyId:"AKIAZ74FJQGL523L7WFP",
    secretAccessKey:"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"
  })

//  const filename= '/Users/rahulrajput/Desktop/video/DJI_0030.MP4';

const filename= '/Users/rahulazmeera/Desktop/images/venu.jpg';

 
  const fileContent = fs.createReadStream(filename);
  //console.log(fileContent);
  const params = {
    Bucket: 'student-corner',
    Key:'filename',
    Body: req.files.filename.data
  }
  
  s3.upload(params, (err, data) => {
    if (err) {
        // console.log(err);
      reject(err)
    }

    res.send({"message":data.Location})
    
  })



})




// added by "manikanta"


// updating main course details
router.put('/updateMainCourseDetails/:courseId', async (req, res) => {
  try {


    const course = await WeeklyCourse.findOne({_id: req.params.courseId});

    if (!course) {
      res.status(404).json({err_msg: "Course not found"});
    }


    await WeeklyCourse.updateOne({_id: req.params.courseId}, {
      // $set: {
      //   CourseName: req.body.CourseName,
      //   ProfessorName: req.body.ProfessorName,
      //   email: req.body.email,
      //   CourseDate: req.body.CourseDate,
      //   Coursetimings: req.body.Coursetimings,
      //   Accessclass: req.body.Accessclass,
      //   Discription: req.body.Discription,
      //   CourseImage: req.body.CourseImage,
      // }
      $set: req.body
    },
    {
      new: true
    }
    )

    res.status(200).json({message: 'Course Details updated successfully'})

  }
  catch(err) {
    res.status(500).json({err_msg: "API Error occured while updating main course details"});
  }
});

// deleting main course
router.delete('/deleteMainCourse/:courseId', async (req, res) => {
  try {


    const course = await WeeklyCourse.findOne({_id: req.params.courseId});

    if (!course) {
      res.status(404).json({err_msg: "Course not found"});
    }


    await WeeklyCourse.deleteOne({_id: req.params.courseId})

    res.status(200).json({message: 'Course Deleted successfully'})

  }
  catch(err) {
    res.status(500).json({err_msg: "API Error occured while deleting main course"});
  }
});


module.exports = router;