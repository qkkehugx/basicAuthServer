const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
  salt: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Auth', authSchema);