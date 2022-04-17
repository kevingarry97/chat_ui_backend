const mongoose = require('mongoose');
const { userSchema } = require('./user');

const blogSchema = new mongoose.Schema({
  text: {
    type: String
  },
  madeBy: {
    type: userSchema
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
})

const Blog = mongoose.model('Blog', blogSchema);

exports.Blog = Blog;
