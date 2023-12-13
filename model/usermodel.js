const mongoose = require("mongoose")

const userdata = new mongoose.Schema({
    username: String,
    email: String,
    number: Number,
    password: String

})

module.exports = mongoose.model("userdata", userdata)