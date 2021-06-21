const mongoose = require('mongoose')

const Tweet = mongoose.model('Tweet', {
  id: String,
  text: String,
  author: String,
  created_at: String
})

module.exports = Tweet