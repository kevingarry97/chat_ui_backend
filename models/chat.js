const mongoose = require('mongoose');
const { userSchema } = require('./user');

const chatSchema = new mongoose.Schema({
  message: {
    type: String
  },
  from: {
    type: userSchema
  },
  room: {
    type: string
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
})

const Chat = mongoose.model('Chat', chatSchema);

exports.Chat = Chat;
