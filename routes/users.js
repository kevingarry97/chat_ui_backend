const express = require('express');
const { User } = require('../models/user');
const { Tokens } = require('../models/token');
const _ = require('lodash');
const upload = require('../multer');
const cloudinary = require('../cloudinary');
const bcryptjs = require('bcryptjs');
const router = express.Router();
const { sendEmail } = require('../utils/index');
const crypto = require('crypto');

router.get('/user', async (req, res) => {
  const user = await User.find();
  if (!user) return res.status(404).send('No User Found');

  res.status(200).send(user)
})

router.post('/auth', async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });
  if (!user) return res.status(400).send('Invalid Email or Password');

  const validPassword = await bcryptjs.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid Email or Password');

  const token = user.generateAuthToken();
  res.status(200).send(token);
})

router.post('/user', upload.single('file'), async (req, res) => {
  const { email, username, password, role } = req.body
  const uploader = async (path) => await cloudinary.upload(path, "File")

  const file = req.file;
  const { url: profileUrl } = await uploader(file.path);

  let user = await User.findOne({ email }) || await User.findOne({ username })
  if (user) return res.status(400).send('User already registered');

  user = new User({
    username,
    email,
    password,
    role,
    profileUrl
  })

  const salt = await bcryptjs.genSalt(10);
  user.password = await bcryptjs.hash(user.password, salt);

  await user.save();
  user.generatePasswordReset();
  await sendVerificationEmail(user, req, res);

  const token = user.generateAuthToken();

  res
    .header('x-auth-token', token)
    .header('access-control-expose-headers', 'x-auth-token')
    .send(_.pick(user, ['_id', 'username', 'email', 'role', 'profileUrl']))

})

router.post('/auth/reset/:token', async (req, res) => {
  let user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } })
  if (!user) return res.status(401).send('Password reset token is invalid or has expired.');

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save()

  const mailOptions = {
    to: user.email,
    from: process.env.FROM_EMAIL,
    subject: "Your password has been changed",
    text: `Hi ${user.username} \n 
      This is a confirmation that the password for your account ${user.email} has just been changed.\n`
  };

  await sendEmail(mailOptions);
  console.log('Reset')
})

router.get('/auth/verify/:token', async (req, res) => {
  const { token } = req.params;
  if (!token) return res.status(404).send('We were unable to find a user for this token.');

  const result = await Tokens.findOne({ token });
  if (!result) res.status(404).send('We were unable to find a valid token. Your token my have expired.');

  let user = await User.findOne({ _id: result.user._id });
  if (!user) return res.status(404).send('We were unable to find a user for this token.');

  if (user.isVerified) return res.status(400).send('This user has already been verified.');

  user.isVerified = true;
  await user.save();

  res.status(200).send("The account has been verified. Please log in.");
})

// User Save

async function sendVerificationEmail(users, req, res) {
  try {
    let user = await User.findById(users._id);
    if (!user) return res.status(404).send('Not Found User');

    let payload = new Tokens({
      user,
      token: crypto.randomBytes(20).toString('hex')
    })

    // Save the verification token
    await payload.save();

    let subject = "Account Verification Token";
    let to = users.email;
    let from = process.env.FROM_EMAIL;
    // let link = "links to";
    let link = "http://" + req.headers.host + "/api/auth/verify/" + payload.token;
    let html = `<p>Hi ${users.username}<p><br><p>Please click on the following <a href="${link}">link</a> to verify your account.</p> 
                  <br><p>If you did not request this, please ignore this email.</p>`;
    await sendEmail({ to, from, subject, html });
    console.log('Sent ')
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = router;
