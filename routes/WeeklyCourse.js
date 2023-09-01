const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
// const { v4: uuidv4 } = require('uuid');
// const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');





//importing schema from models folder
const WeeklyCourse = require('../models/WeeklyCourse');
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

//get all weekly courses
router.get('/', (req, res, next) => {
   WeeklyCourse.find()
    .exec()
    .then( docs => {
        console.log(docs);
        res.status(200).json(docs);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});


//get all weekly courses by professor
router.get('/:userName', (req, res, next) => {
  WeeklyCourse.find({username: req.params.userName})
   .exec()
   .then( docs => {
       console.log(docs);
       res.status(200).json(docs);
   })
   .catch(err => {
       console.log(err);
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
  console.log(JSON.stringify(req.body) + "this is req.body incomming");
  try {
    var CourseContentdata = { 
      _id: new mongoose.Types.ObjectId(),
      week : req.body.CourseContent.week,
      courseVideo : req.body.CourseContent.courseVideo,
      videoLink: req.body.CourseContent.videoLink,
      pdf : req.body.CourseContent.pdf,
      readingmeterial: req.body.CourseContent.readingmeterial,
      assignment: req.body.CourseContent.readingmeterial,
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
      username: req.body.username,
      CourseDate: req.body.CourseDate,
      Coursetimings: req.body.Coursetimings,
      Accessclass: req.body.Accessclass,
      Discription: req.body.Discription,
      CourseImage: req.body.CourseImage, // Use the uploaded file name
      CourseContent: CourseContentdata
    });

    w_course.save()
      .then(result => {
        console.log(result + "this is the result");
        res.status(201).json({
          message: 'Handling POST requests to /Weeklycourse',
          courseCreated: result
        });
      })
      
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  } catch (error) {
    console.log(error);
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
    const addWeek = {
        _id: new mongoose.Types.ObjectId(),
        week: req.body.week,
        vodeoLink: req.body.vodeoLink,
        readingmeterial: req.body.readingmeterial,
        assignment: req.body.assignment,
        additionalContent: req.body.additionalContent,
        announcement: req.body.announcement,
        startDate: req.body.startDate,
        endDate: req.body.endDate

        
    }
    console.log(req.body.week);
    //form the query to push new into existing data
    var query = {$push: {CourseContent: addWeek}}
    console.log(req.body._id);
    console.log(addWeek)
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

router.post('/updateWeek/:id', (req, res, next) => {
    const weekId = req.params.id;
    const update = {
      _id: new mongoose.Types.ObjectId(),
      week: req.body.week,
      readingmeterial: req.body.readingmeterial,
      assignment: req.body.assignment,
      additionalContent: req.body.additionalContent,
      announcement: req.body.announcement,
      startDate: req.body.startDate,
      endDate: req.body.endDate
    };
    WeeklyCourse.findOneAndUpdate(
      { "CourseContent._id": weekId },
      { $set: { "CourseContent.$": update } },
      { new: true }
    )
    .select()
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

router.delete('/deleteWeek/:weekId', (req, res, next) => {
  const  weekId = req.params.weekId;
  console.log(weekId)
  const convertedId = mongoose.Types.ObjectId(weekId);

  WeeklyCourse.updateOne(
    { "CourseContent._id": convertedId },
    { $pull: { CourseContent: { _id: convertedId } } },
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
      console.error(err);
      res.status(500).json({
        message: 'Server Error',
        error: err,
      });
    });
});
  
  //to get single course with ID
router.get('/:w_courseId',(req, res, next) => {
    const id = req.params.w_courseId;
   WeeklyCourse.findById(id)
    .exec()
    .then(doc => {
        console.log("From database", doc);
        if (doc) {
            res.status(200).json(doc);
        } else {
            res.status(404).json({massage: 'No valid entry found for given ID'});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});    
 
router.patch('/:w_courseId',(req, res, next) => {
   const id = req.params.w_courseId;
   const updateOps = {};
   for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
   }
   WeeklyCourse.updateMany({ _id: id }, { $set: updateOps }) 
    .exec()
    .then( result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });

});

router.delete('/:w_courseId',(req, res, next) => {
    const id = req.params.w_courseId;
    WeeklyCourse.remove({ _id: id })
        .exec()
        .then( result => {
            res.status(200).json({massage: "Course deleted"});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


//image upload

router.post('/Uploadfile', (req, res) => {
  
  console.log("upload file triggered")
    // console.log(req.files.filename);
    console.log(req.files.filename.name)
  
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
        console.log(err);
      reject(err)
    }

    res.send({"message":data.Location})
    
  })







})

module.exports = router;