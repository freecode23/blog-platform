const mongoose = require("mongoose");


//- create interface / schema
const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Cannot add a post without a title"],
        unique: true
    },

    content: {
        type: String,
        required: [true, "Cannot add a post without any description"],
    },
    // blog cover photo
    picture: {
        type: String,
        required: [true, "Cannot add a post without a picture"],
    },
    // froala pictures
    pictures: {
        type: Array,
        required: false,
    },
    github: {
        type: String,
        required: false,
    },
    categories: {
        type: Array,
        required: false
    },
    comments: {
        type: Array,
        required: false
    },
    likes: {
        type: Number,
        required: true
    }

}, { timestamps: true })


// - create the collection and export it
module.exports = mongoose.model("Post", PostSchema);