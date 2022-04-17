const express = require('express');
const { Blog } = require('../models/blog');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/blog', auth, async (req, res) => {
  const blog = await Blog.find();
  if (!blog) return res.status(404).send('Not Found!!');

  res.status(200).send(blog);
})

router.post('/blog', async (req, res) => {
  const blog = new Blog({
    text: req.body.text
  })

  await blog.save();

  res.status(200).send(blog);
})

router.put('/blog/:id', auth, async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id,
    {
      text: req.body.text
    },
    {
      new: true
    }
  );

  if (!blog) return res.status(400).send('Not Blog with ID Found');

  res.status(200).send(blog);
})

module.exports = router;
