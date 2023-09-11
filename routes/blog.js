const express = require('express');  
const router = express.Router();
const mongoose = require('mongoose');
const blogModel = require('../models/blog');

// get all method..
router.get('/', (req, res, next) => {
  blogModel.find()
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        posts: docs.map(doc => {
          return {
            title: doc.title,
            username: doc.username,
            content: doc.content,
            Name: doc.Name,
            images: doc.images,
            _id: doc._id,
            timestamp: doc.timestamp
          }
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

//get all blogs posted professor
router.get('/:userName', (req, res, next) => {
  blogModel.find({username: req.params.userName})
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

  
  // post a new task
  router.post('/', (req, res, next) => {
    // Create a new blog document with request body data

    // console.log(req.body.commentData);
    //   var commentData = { 
    //     _id: new mongoose.Types.ObjectId(),
    //     username : req.body.commentData.username,
    //     comment: req.body.commentData.comment,
    //     timeStamp: new Date()  
    //     }


    const blog = new blogModel({
      _id: mongoose.Types.ObjectId(),
      title: req.body.title,
      username: req.body.username,
      content: req.body.content,
      Name: req.body.Name,
      images: req.body.images,
      timeStamp: new Date(), // add the current date and time
      comments: commentData
    });

    // save the new blog to the database
    blog
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Blog created successfully",
        createdBlog: {
          title: result.title,
          username: result.username,
          content: result.content,
          Name: result.Name,
          _id: result._id,
          timestamp: result.timestamp // Include the timestamp in the response
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error:err
      });
    });
  });

// create a PUT route for updating a course by ID..
router.put('/:id', (req, res) => {
  const blogId = req.params.id;

  blogModel.findByIdAndUpdate(blogId, req.body, { new: true })
    .exec()
    .then((updatedBlog) => {
      res.status(200).json({
        message: 'blog post update successfully'
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error });
    });
});


// delete api method...
  router.delete('/:id', (req, res) => {
    const blogId = req.params.id;
  
    blogModel.findByIdAndDelete(blogId)
      .exec()
      .then(() => {
        res.status(200).json({ message: 'Blog post deleted successfully' });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ error });
      });
  });

  // Likes API
  router.post('/:id/like', (req, res, next) => {
    const BlogId = req.params.id; // Corrected parameter name
  
    // Find the blog post by ID
    blogModel.findById(BlogId)
      .exec()
      .then(Blog => {
        if (!Blog) {
          return res.status(404).json({ message: 'Blog not found' });
        }
  
        // Increment the likes count and save the updated blog post
        Blog.likes += 1;
        return Blog.save();
      })
      .then(updatedBlog => {
        res.status(200).json({ message: 'Like added successfully', updatedBlog });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  });

  // Comments API
  // router.post('/:id/comment', (req, res, next) => {
  //   const BlogId = req.params.id;
  //   const comment = {
  //     username: req.body.username,
  //     comment: req.body.comment
  //   };
  //    // Assuming the request body contains the comment data
  
  //   // Find the blog post by ID
  //   blogModel.findById(BlogId)
  //     .exec()
  //     .then(Blog => {
  //       if (!Blog) {
  //         return res.status(404).json({ message: 'Blog not found' });
  //       }
  
  //       // Add the new comment to the comments array in the blog post
  //       Blog.comments.push(comment);
  //       return Blog.save();
  //     })
  //     .then(updatedBlog => {
  //       res.status(200).json({ message: 'Comment added successfully', updatedBlog });
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       res.status(500).json({ error: err });
  //     });
  // });
  

  //comment router
  router.post('/comment', (req, res, next) =>{
    const comment = {
      _id: new mongoose.Types.ObjectId(),
      username: req.body.username,
      comment: req.body.comment,
      timeStamp: new Date() 
    }
    console.log(req.body.comment);
    console.log(req.body.username);

    var query = {$push: {comments: comment}}
    console.log(req.body._id);
    console.log(comment)

    blogModel.findByIdAndUpdate({_id: req.body._id}, query)
    .select()
    .exec()
    .then(doc => {
      if (doc){
        res.status(200).json({
          message: "Comment posted successfully",
          data: doc
        })
      }else{
        res.status(200).json({
          message: "no matching docs found"
        })
      }
    })
    .catch(err => {
      res.status(420).json({
        message: "failed",
        error: err
      })
    })

  });

  //like router for blogs
 // Assuming you have the necessary imports and route setup here

  router.post('/like', async (req, res, next) => {
    const blogId = req.body.blogId;
    const username = req.body.username;

    try {
      const blog = await Blog.findById(blogId);

      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }

      const userIndex = blog.likedBy.indexOf(username);

      if (userIndex !== -1) {
        // User has already liked the blog, so undo the like
        blog.likes -= 1;
        blog.likedBy.splice(userIndex, 1); // Remove the user from likedBy array
      } else {
        // User has not liked the blog, so add the like
        blog.likes += 1;
        blog.likedBy.push(username);
      }

      // Save the updated blog
      const updatedBlog = await blog.save();

      res.status(200).json({
        message: 'Blog like updated successfully',
        updatedBlog: updatedBlog,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: err,
      });
    }
  });



  

  

  module.exports = router;