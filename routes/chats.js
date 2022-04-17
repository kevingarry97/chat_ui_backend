const express = require('express');
const { Chat } = require('../models/chat');
const { Room } = require('../models/room');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/chat/:id', auth, async (req, res) => {
  const chat = await Chat.find({ "room._id": req.params.id });
  if (!chat) return res.status(404).send('No Message Found');

  res.status(200).send(chat);
})

router.post('/chat', auth, async (req, res) => {
  const { room: receiver, message } = req.body;

  let room = await Room.findById(receiver);
  if (!room) return res.status(404).send('No Room Found');

  let chat = new Chat({
    message,
    room,
    from: req.user
  })

  await chat.save();

  res.status(200).send('Chat Sent Successfully');
})

module.exports = router;
