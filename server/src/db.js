const mongoose = require('mongoose')

function dbConnect() {
  const DB_CONNECT_URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.iuvn4.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  
  const DB_CONNECT_OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }

  mongoose.connect(DB_CONNECT_URL, DB_CONNECT_OPTIONS)
}

module.exports = {
  dbConnect
}