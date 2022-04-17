const mongoose = require('mongoose');
const { userSchema } = require('./user');

const roomSchema = new mongoose.Schema({
  room: {
    type: String
  },
  creator: {
    type: userSchema
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const Room = mongoose.model('Room', roomSchema);

exports.roomSchema = roomSchema;
exports.Room = Room;
