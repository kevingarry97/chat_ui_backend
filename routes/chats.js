const express = require('express');
const { Chat } = require('../models/chat');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/chat/:id', auth, async (req, res) => {
  const chat = await Chat.find({ "to._id": req.params.id });
  if (!chat) return res.status(404).send('No Message Found');

  res.status(200).send(chat);
})

router.post('/chat', auth, async (req, res) => {
  const { room, message } = req.body

  let chat = new Chat({
    message,
    room,
    from: req.user
  })

  await chat.save();

  res.status(200).send('Chat Sent Successfully');
})

module.exports = router;
