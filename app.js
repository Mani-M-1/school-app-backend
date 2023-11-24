//importing express in to our project app
const express = require('express');
const app = express();
var logger = require('morgan'); //morgan is for next function we are using in our routes after req,res,next
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const AWS = require('aws-sdk');
const fs = require('fs');
const fileRead= require('express-fileupload');
//for hiding secret keys in .env file so no one can access
// dotenv = require('dotenv');

// var os = require('os');


// //new addings i need remove these
// http = require('http'),
// helmet = require('helmet'),
// // secrets = require('./secrets'),
// awsController = require('./aws-controller');

//for mail sevice from node js
// it used to send mails to users
const nodemailer = require('nodemailer');

// const multer = require('multer');
// const upload = multer({ dest: 'uploads/'});
// const { uploadFile, getFileStream } = require('./s3');

// //"main": "index.js", package.json file

// // importing courses router in app from router folder
// const coursesRoutes = require('./routes/courses');
const WeeklyCourseRoutes = require('./routes/WeeklyCourse');
const userSignupRoutes = require('./routes/Signup');
const sendNotificationsRoutes = require('./routes/sendNotifications');
const todoRoutes = require('./routes/todo');
const blogRoutes = require('./routes/blog');
const courEnrollRoutes = require('./routes/courseEnrollment');
// const errorHandler = require('errorhandler');
// const secrets = require('./secrets');

//mongo db connection
mongoose.connect('mongodb+srv://venuazmeera:mongo_venu69@cluster0.7ewrhqm.mongodb.net/?retryWrites=true&w=majority');
//appling pakages to our incoming requests
//app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
// app.use(Onesignal);
// new addings
// app.use(helmet());

// dotenv.load();

//for .env file
if(process.env.NODE_ENV === 'development'){
    app.use(logger('dev'));
    // app.use(errorHandler())
}


// // //for nodenailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    // port: 3000,
    logger: true,
    debug: true,
    secureConnection: false,
    auth : {
        user: "venuazmeera69@gmail.com",
        pass: "srquxcuhznnkngqe"
    }
});


const options = {
    // 
    from: "venuazmeera69@gmail.com",
    to: "venuazmeera69@gmail.com",
    subject: "Sending mail with node js",
    text: "hello there"
};


// transporter.sendMail(options, function (err, info){
//     if(err){
//         console.log(err);
//         return;
//     }
//     console.log("sent: "+ info.response);
// })





//for not getting cores errors
app.use((req, res, next) => {

   res.header("Access-Control-Allow-Origin", "*", "https://nice-gold-pike-shoe.cyclic.app", "http://localhost:8100");
   res.header(
    "Access-Control-Allow-Headers", "*"
    //"Origin, X-Requested-With, Content-Type, Accept, Authorization"
   ); 
    // res.header('Access-Control-Allow-Origin', 'https://nice-gold-pike-shoe.cyclic.app/'); // Replace '*' with the actual domain(s) allowed to access the resource
    // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    // next();

   if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'POST, GET, DELETE, PATCH');
        return res.status(200).json({});
    }
    next();
});


//for testing cyclic or vercel
app.get("/", (req, res, next)=>{
    res.json({
        name:"hello",
        message:"i am working"
    })
})


//image posting
// const port = 3000
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileRead());
//app.use(express.urlencoded());
// var type = upload.single('recfile');
//app.use(multer({ dest: './uploads/'}));

//for making access key and screet keys to hide 
const bucketName = process.env.AWS_BUCKET_NAME;
// console.log(bucketName);
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

//send video and audio and images and pdf's files to s3
app.post('/uploadfile', (req, res) => {
  
    console.log(req.files.filename);
  
  const s3 = new AWS.S3({
     accessKeyId:"AKIAZ74FJQGL523L7WFP",
    secretAccessKey:"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"
  })

//  const filename= '/Users/rahulrajput/Desktop/video/DJI_0030.MP4';

// const filename= '/Users/rahulazmeera/Desktop/images/venu.jpg';

 
  // const fileContent = fs.createReadStream(filename);
  //console.log(fileContent);
  const params = {
    Bucket: "student-corner",
    Key:req.files.filename.name,
    Body: req.files.filename.data
  }
  
//   console.log(url);

  s3.upload(params, (err, data) => {
    if (err) {
        console.log(err);
      reject(err)
    }

    res.send({"message":data.Location, "isSuccess": true})

    
  })

  //res.send('Hello World!');








})


// // app.listen(port, () => {
// //   console.log(`Example app listening on port ${port}`)
// // })


// //Get the image with "key" which is exists in s3
// app.get('/images/:key', (req, res)=> {
//     const key = req.params.key
//     const readStream = getFileStream(key);

//     readStream.pipe(res);
// })

// // Posting images to S3 bucket
// app.post('/images', upload.single('image'), async (req, res)=>{
//     const file =req.file
//     console.log(file);
//     const result = await uploadFile(file);
//     console.log(result);
//     const description = req.body.description
//     //if a client makes request this will go and grab the image from s3 bucket
//     res.send({imagePath: '/images/${result.Key}'});
// })

// //for showing massage in vercel
// // app.use("/", (req, res, next)=>{
// //     res.json({ message: "Hello from express app"})
// // });
// //routes which should handle requests 
// //if you create anothor route mension here 

// app.use('/courses', coursesRoutes);
app.use('/weeklyCourse', WeeklyCourseRoutes);
app.use('/Signup', userSignupRoutes);
app.use('/notifications', sendNotificationsRoutes);
app.use('/todo', todoRoutes);
app.use('/blog', blogRoutes);
app.use('/enrollCourse', courEnrollRoutes);

// For error handling
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;