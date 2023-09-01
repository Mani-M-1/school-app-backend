const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: { type: String, required: true},
  comment: {type: String, required: false},
  timestamp: { type: Date, default: Date.now }
})


const BlogSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  title: { type: String, required: true },
  username: { type: String, required: true},
  content: { type: String, required: true },
  Name: { type: String, required: true },
  images: { type: [String], default: [] },
  timestamp: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 }, // Number of likes for the blog
  comments: { type: [commentSchema], require: false}
});

module.exports = mongoose.model('Blog', BlogSchema);