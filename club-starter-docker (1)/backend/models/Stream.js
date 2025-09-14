const mongoose = require('mongoose');
const StreamSchema = new mongoose.Schema({
  title: String,
  performer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isLive: { type:Boolean, default:false },
  viewerCount: { type:Number, default:0 },
  createdAt: { type:Date, default: Date.now }
});
module.exports = mongoose.model('Stream', StreamSchema);
