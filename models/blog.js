const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  text: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
})

const Blog = mongoose.model('Blog', blogSchema);

exports.Blog = Blog;
