const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type:String, required:true, unique:true },
  email: { type:String, required:true, unique:true },
  passwordHash: { type:String, required:true },
  displayName: String,
  role: { type:String, enum:['user','performer','admin'], default:'user' },
  credits: { type:Number, default:0 },
  createdAt: { type:Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
