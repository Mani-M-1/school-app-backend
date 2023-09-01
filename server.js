const express = require('express')
const app = express()
const router = express.Router();
const mongoose = require('mongoose');
const Course = require('./models/course');
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//mongo db connection
mongoose.connect('mongodb+srv://venuazmeera:mongo_venu69@cluster0.7ewrhqm.mongodb.net/?retryWrites=true&w=majority');

app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yo!')
})


app.get('/course', (req, res, next) => {
   Course.find()
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

app.post('/course', (req, res, next) => {
    const course = new Course({
        _id: new mongoose.Types.ObjectId(),
        CourseName: req.body.CourseName,
        ProfessorName: req.body.ProfessorName,
        CourseDiscription: req.body.CourseDiscription,
        CourseBook: req.body.CourseBook

    });
    course
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                massage: 'Handling POST requests to /courses',
                courseCreated: result
            });
        })
        .catch(err => {
             console.log(err);
             res.status(500).json({
                error: err
             });
        })
});

app.listen(process.env.PORT || 3000)