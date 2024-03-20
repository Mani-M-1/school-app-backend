const express = require('express');  
const router = express.Router();
const mongoose = require('mongoose');
const blogModel = require('../models/blog');

// get all blogs method..
router.get('/school/:schoolId', (req, res, next) => {
  blogModel.find({schoolId: req.params.schoolId})
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        posts: docs
        // posts: docs.map(doc => {
        //   return {
        //     title: doc.title,
        //     email: doc.email,
        //     content: doc.content,
        //     Name: doc.Name,
        //     images: doc.images,
        //     _id: doc._id,
        //     timestamp: doc.timestamp
        //   }
        // })
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
router.get('/:email', (req, res, next) => {
  blogModel.find({email: req.params.email})
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



// get specific blog by id {written by "manikanta"}
router.get('/getSpecificBlog/:blogId', async (req, res) => {
  try {
    const blog = await blogModel.findById(req.params.blogId);

    if (!blog) {
      res.status(404).json({err_msg: "Blog not found"});
    }

    
    res.status(200).json({
      message: "Blog fetched successfully",
      blogDetails: blog
    })
  }
  catch(err) {
    res.status(500).json({err_msg: "API Error occured while getting specific blog"})
  }
})

  
  // post a new task
  router.post('/', (req, res, next) => {
    // Create a new blog document with request body data

    // console.log(req.body.commentData);
    //   var commentData = { 
    //     _id: new mongoose.Types.ObjectId(),
    //     email : req.body.commentData.email,
    //     comment: req.body.commentData.comment,
    //     timeStamp: new Date()  
    //     }

    console.log(JSON.stringify(req.body) + "this is req.body incomming");

    const blog = new blogModel({
      _id: new mongoose.Types.ObjectId(),
      title: req.body.title,
      email: req.body.email,
      content: req.body.content,
      Name: req.body.Name,
      images: req.body.images,
      timeStamp: new Date(), // add the current date and time
      // comments: commentData
      comments: req.body.comments,
      schoolId: req.body.schoolId
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
          email: result.email,
          content: result.content,
          Name: result.Name,
          images: result.images,
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



    // Like a blog
router.post('/likeblog/:blogId', async (req, res) => {
  const { blogId } = req.params;
  console.log(blogId)
  try {
      const { email } = req.body;
      const blogLike = { email, blogId: blogId, isLiked: true };
      console.log(email);
      // Update the blog with the like
      const blog = await blogModel.findByIdAndUpdate(
          blogId,
          { $push: { likedBy: blogLike } },
          { new: true }
      );

      res.status(200).json(blog);
  } catch (err) {
      res.status(500).json({ err_msg: err.message });
  }
});






// Dislike a blog
router.post('/dislikeblog/:blogId', async (req, res) => {
  const { blogId } = req.params

  try {
    const { email } = req.body;
    const blogLike = { email, blogId: blogId, isLiked: true };
      // Remove the like record
      const blog = await blogModel.findByIdAndUpdate(
          blogId,
          { $pull: { likedBy: blogLike } },
          { new: true }
      );

      res.status(200).json(blog);
  } catch (err) {
      res.status(500).json({ err_msg: err.message });
  }
});



// remove all likes 
router.delete('/deletedAllLikes/:blogId', async (req, res) => {
  const { blogId } = req.params

  try {
      const blog = await blogModel.findByIdAndUpdate(
          blogId,
          { $set: { likedBy: [] } },
          { new: true }
      );

      res.status(200).json({message: "All likes deleted"});
  } catch (err) {
      res.status(500).json({ err_msg: err.message });
  }
});




// // GET liked users count
// router.get('/getLikesCount', async (req, res) => {
//   try {
//       // Fetch all blogs
//       const blogs = await blogModel.find();

//       // Calculate like counts for each blog
//       const blogsWithLikeCounts = blogs.map(blog => {
//           return {
//               ...blog.toObject(),
//               likeCount: blog.likes.length // Calculate like count
//           };
//       });

//       res.status(200).json(blogsWithLikeCounts);
//   } catch (err) {
//       res.status(500).json({ error: err.message });
//   }
// });












  //comment router
  router.post('/comment', (req, res, next) =>{
    const comment = {
      _id: new mongoose.Types.ObjectId(),
      email: req.body.email,
      comment: req.body.comment,
      timeStamp: new Date() 
    }
    console.log(`req.body.comment: ${req.body.comment}`);
    console.log(`req.body.email: ${req.body.email}`);

    var query = {$push: {comments: comment}}
    console.log(`req.body._id: ${req.body._id}`);
    console.log(`comment: ${comment}`)

    blogModel.findByIdAndUpdate({_id: req.body._id}, query)
    .select()
    .exec()
    .then(doc => {
      if (doc){
        res.status(200).json({
          message: "Comment posted successfully",
          data: doc
        })
        console.log(doc);
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

  // delete all comments for a specific blog 
  router.delete('/deleteAllComments/:blogId', async (req, res) => {
    try {
      const {blogId} = req.params;

      await blogModel.updateOne({_id: blogId}, {$set: {comments: []}}, {new: true})

      res.status(200).json({message: "All comments are deleted successfully"});
    }
    catch(err) {cl
      res.status(500).json({err_msg: "API Error occured while deleting comments"});
    }
  })

  //like router for blogs
 // Assuming you have the necessary imports and route setup here

//   router.post('/like', async (req, res, next) => {
//     const blogId = req.body.blogId;
//     const email = req.body.email;
// // here we need pu action : it should like and unlike
// //i need to write it in schema
//     try {
//       const blog = await Blog.findById(blogId);

//       if (!blog) {
//         return res.status(404).json({ message: 'Blog not found' });
//       }

//       const userIndex = blog.likedBy.indexOf(email);

//       if (userIndex !== -1) {
//         // User has already liked the blog, so undo the like
//         blog.likes -= 1;
//         blog.likedBy.splice(userIndex, 1); // Remove the user from likedBy array
//       } else {
//         // User has not liked the blog, so add the like
//         blog.likes += 1;
//         blog.likedBy.push(email);
//       }

//       // Save the updated blog
//       const updatedBlog = await blog.save();

//       res.status(200).json({
//         message: 'Blog like updated successfully',
//         updatedBlog: updatedBlog,
//       });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({
//         error: err,
//       });
//     }
//   });



  

  

  module.exports = router;