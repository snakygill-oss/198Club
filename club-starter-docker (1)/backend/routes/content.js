const express = require('express');
const router = express.Router();
const Stream = require('../models/Stream');
const auth = require('../utils/authMiddleware');

// create a stream entry (performer)
router.post('/streams', auth, async (req,res)=>{
  if(req.user.role !== 'performer') return res.status(403).json({msg:'Not performer'});
  const s = await Stream.create({ title: req.body.title, performer: req.user.id, isLive: true });
  res.json(s);
});

// list streams
router.get('/streams', async (req,res)=>{
  const streams = await Stream.find().populate('performer','username displayName').sort({createdAt:-1});
  res.json(streams);
});

module.exports = router;
