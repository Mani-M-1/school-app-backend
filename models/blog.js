// const mongoose = require('mongoose');

// const commentSchema = new mongoose.Schema({
//   _id: mongoose.Schema.Types.ObjectId,
//   email: { type: String, required: true},
//   comment: {type: String, required: false},
//   timestamp: { type: Date, default: Date.now }
// })


// const BlogSchema = new mongoose.Schema({
//   _id: mongoose.Types.ObjectId,
//   title: { type: String, required: true },
//   email: { type: String, required: false},
//   content: { type: String, required: true },
//   Name: { type: String, required: true },
//   images: { type: [String], default: [] },
//   timestamp: { type: Date, default: Date.now },
//   likes: { type: Number, default: 0 }, // Number of likes for the blog
//   comments: { type: [commentSchema], require: false},
//   likedBy: { type: [String], default: [] } // Array to store emails of users who liked the blog
// });

// module.exports = mongoose.model('Blog', BlogSchema);

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: { type: String, required: true },
  comment: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const blogLikeSchema = new mongoose.Schema({
  isLiked: {type: Boolean, default: false},
  email: {type: String, required: true},
  blogId: {type: String, required: true}
})

const BlogSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  title: { type: String, required: true },
  email: { type: String, required: true },
  content: { type: String, required: true },
  Name: { type: String, required: true },
  // images: { type: [String], default: [] },
  images: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  // likes: { type: Number, default: 0 }, // Number of likes for the blog
  comments: { type: [commentSchema] },
  likedBy: { type: [blogLikeSchema] }, // Array to store emails of users who liked the blog
  schoolId: {type: String, required: true}
});

module.exports = mongoose.model('Blog', BlogSchema);
