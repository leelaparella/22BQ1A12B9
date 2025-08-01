const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
  timestamp: Date,
  referrer: String,
  location: String,
});

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  validity: { type: Number, default: 30 },
  clicks: [clickSchema],
});

module.exports = mongoose.model('Url', urlSchema);
