const mongoose = require('mongoose')

function dbConnect() {
  const DB_CLUSTER = 'dom'
  const DB_NAME = 'globo'
  const DB_USERNAME = 'dom'
  const DB_PASSWORD = '5e208w1y'
  const DB_CONNECT_URL = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_CLUSTER}.iuvn4.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
  
  const DB_CONNECT_OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }

  mongoose.connect(DB_CONNECT_URL, DB_CONNECT_OPTIONS)
}

module.exports = {
  dbConnect
}