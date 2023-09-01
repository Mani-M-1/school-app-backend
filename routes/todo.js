const express = require('express');  
const router = express.Router();
const mongoose = require('mongoose');
const todomodel = require('../models/todo');

//search router

router.get("/search/:key",async (req,res) => { 
  let data = await todomodel.find(
      {
          "$or":[
              {task:{$regex:req.params.key}},
              {priority:{$regex:req.params.key}}
          ]
      }
  )
  res.send(data)
});

// Handle incoming GET requests to /task
// get all
router.get('/', (req, res, next) => {
    console.log('alltask called')
   todomodel.find()
   //.select()
   .exec()
   .then(doc => {
    const response = {
      count: doc.length,
      tasks: doc.map(doc => {
          return {
              task: doc.task,
              priority: doc.priority,
              date: doc.date,
              category: doc.category,
              _id: doc._id
          }
      })
  };
       console.log(response);
       res.status(200).json(response);
   })
   .catch(err => {
       console.log(err);
       res.status(500).json({
        error: err
       });
   });
});

//get router that finds tasks by username

router.get('/:username', (req, res, next) => {
  console.log('alltask called')

  //it will get the data based on username
 todomodel.find({username: req.params.username})
 //.select()
 .exec()
 .then(doc => {
  const response = {
    count: doc.length,
    tasks: doc.map(doc => {
        return {
            username: doc.userName,
            task: doc.task,
            priority: doc.priority,
            date: doc.date,
            category: doc.category,
            _id: doc._id
        }
    })
};
     console.log(response);
     res.status(200).json(response);
 })
 .catch(err => {
     console.log(err);
     res.status(500).json({
      error: err
     });
 });
});

//post router
router.post('/', (req, res, next) => {
    const todo = new todomodel({
       _id: mongoose.Types.ObjectId(),
        username: req.body.username,
        task: req.body.task,
        priority: req.body.priority,
        date: req.body.date,
        category: req.body.category
    });
    todo
    .save()
    .then(result => {
      console.log(result);
    })
    .catch(err => console.log(err));
    res.status(201).json({
        message: 'Handling POST request to /todo',
        createdTodo: todo
     });
     next();
    });

  

    //get 1..this id based get
router.get('/:todoId', (req, res, next) => {
    const id = req.params.todoId;
    //const todos = todos.find((p) => p._id == req.params.id);
    todomodel.findById(id)
    .select('task priority date category _id')
    .exec()
    .then(doc => {
        console.log("Form database", doc);
        if (doc) {
            res.status(200).json(doc)
        } else {
            res.status(404).json({message: 'No valid entry for founded ID'});
        }
    })
    .catch(err => {
         console.log(err);
         res.status(500).json({error: err});
    });
});

// Define the PACTH route for updating a todo
router.post('/:todoId', (req, res, next) => {
    const id = req.params.todoId;
    //const product = products.find((p) => p._id == match.params.id);
  
    // Define the update query
    const updateQuery = {};   
  
    // Update the task property if it exists in the request body
    if (req.body.task) {
      updateQuery.task = req.body.task;
    }
  
    // Update the priority property if it exists in the request body
    if (req.body.priority) {
      updateQuery.priority = req.body.priority;
    }
  
    // Update the date property if it exists in the request body
    if (req.body.date) {
      updateQuery.date = req.body.date;
    }
  
    // Update the category property if it exists in the request body
    if (req.body.category) {
      updateQuery.category = req.body.category;
    }
  
    // Update the todo item in the database
    todomodel.updateMany({ _id: id }, updateQuery)
      .exec()
      .then(result => {
        console.log(result);
        res.status(200).json({
          message: 'Todo item updated successfully'
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

  router.delete('/:todoId', (req, res, next) =>{ 
    todomodel.remove({_id: req.params.todoId })
    .exec()
    .then(result => {
     res.status(200).json({
        message: 'Task deleted'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
  });

  //this is the course adding method post call...



module.exports = router;