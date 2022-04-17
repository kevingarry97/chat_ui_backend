const mongoose = require('mongoose');
const { userSchema } = require('./user');
const { roomSchema } = require('./room');

const chatSchema = new mongoose.Schema({
  message: {
    type: String
  },
  from: {
    type: userSchema
  },
  room: {
    type: roomSchema
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
})

const Chat = mongoose.model('Chat', chatSchema);

exports.Chat = Chat;
