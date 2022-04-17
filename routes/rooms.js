const express = require('express');
const { Room } = require('../models/room');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/room', auth, async (req, res) => {
  const room = await Room.find();
  if (!room) return res.status(404).send('No room Rooms Found');

  res.status(200).send(room);
});

router.post('/room', auth, async (req, res) => {
  const { room } = req.body;
  let chat = await Room.findOne({ room: room });
  if (chat) return res.status(400).send('Chat Room already exists');

  chat = new Room({
    room,
    creator: req.user
  });

  await chat.save();

  res.status(200).send(chat)
})

module.exports = router;
