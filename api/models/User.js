const mongoose = require("mongoose");


//- create interface / schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "cannot add an user without name"],
        unique: true
    },

    email: {
        type: String,
        required: [true, "cannot add an user without email"],
        unique: true
    },

    about: {
        type: String,
        default: ""
    },

    linkedin: {
        type: String,
        default: ""
    },

    github: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },

    sub: {
        type: String,
        default: ""
    },
    profilePic: {
        type: String,
        default: ""
    },

    resumeKey: {
        type: String,
        default: ""
    },

}, { timestamps: true })


// - create the collection and export it
module.exports = mongoose.model("User", UserSchema);