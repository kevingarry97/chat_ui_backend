const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const config = require('config');

const userSchema = new mongoose.Schema({
  username: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  role: {
    type: String,
    enum: ["user", "moderator", "admin"]
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  profileUrl: {
    type: String
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date
  }
})

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ username: this.username, _id: this._id, email: this.email, role: this.role, profileUrl: this.profileUrl }, config.get('jwtPrivatekey'))
  return token;
}

userSchema.methods.generatePasswordReset = function () {
  this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};

const User = mongoose.model('User', userSchema);

exports.User = User;
exports.userSchema = userSchema;
