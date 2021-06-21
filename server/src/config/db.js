const mongoose = require('mongoose')

const DB_CONNECT_URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.iuvn4.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

function dbConnect() {
  mongoose.connect(DB_CONNECT_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
}

module.exports = {
  dbConnect
}