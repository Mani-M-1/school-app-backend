const express = require('express');  
const router = express.Router();
const mongoose = require('mongoose');
const todomodel = require('../models/todo');



//search task
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

// get all tasks
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


// get tasks of a user by email 
router.get('/:email', (req, res, next) => {
  console.log('alltask called')

  //it will get the data based on email
 todomodel.find({email: req.params.email})
 //.select()
 .exec()
 .then(doc => {
  const response = {
    count: doc.length,
    tasks: doc.map(doc => {
      return {
        email: doc.email,
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



//create a new task
router.post('/', (req, res, next) => {
  const todo = new todomodel({
    _id: new mongoose.Types.ObjectId,
    email: req.body.email,
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

  
// get a task on taskId
router.get('/:todoId', (req, res, next) => {
  const id = req.params.todoId;
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

// update task
router.put('/:todoId', (req, res, next) => {
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
  todomodel.updateOne({ _id: id }, updateQuery)
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


//delete task
router.delete('/:todoId', (req, res, next) =>{ 
  todomodel.findByIdAndRemove({_id: req.params.todoId })
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




module.exports = router;