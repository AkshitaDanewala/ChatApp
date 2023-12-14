const mongoose = require("mongoose")
const plm = require("passport-local-mongoose")
const userdata = new mongoose.Schema({
    username: String,
    email: String,
    number: Number,
    password: String,
    forgotpassword:{
        type: String,
        default: -1
    }

})
userdata.plugin(plm)
module.exports =  new mongoose.model("userdata", userdata)