const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// signup
router.post('/signup', async (req,res)=>{
  const { username, email, password } = req.body;
  if(!username||!email||!password) return res.status(400).json({msg:'Missing fields'});
  const existing = await User.findOne({ $or: [{ email }, { username }]});
  if(existing) return res.status(400).json({msg:'User exists'});
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const user = await User.create({ username, email, passwordHash });
  const token = jwt.sign({ id:user._id, username:user.username, role:user.role }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
  res.json({ token, user: { id:user._id, username:user.username, email:user.email }});
});

// login
router.post('/login', async (req,res)=>{
  const { email, password } = req.body;
  if(!email||!password) return res.status(400).json({ msg:'Missing' });
  const user = await User.findOne({ email });
  if(!user) return res.status(400).json({ msg:'No account' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if(!ok) return res.status(400).json({ msg:'Invalid creds' });
  const token = jwt.sign({ id:user._id, username:user.username, role:user.role }, process.env.JWT_SECRET || 'devsecret', { expiresIn:'7d' });
  res.json({ token, user: { id:user._id, username:user.username, email:user.email }});
});

module.exports = router;
