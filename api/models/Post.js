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

    picture: {
        type: String,
        required: [true, "Cannot add a post without a picture"],
    },
    categories: {
        type: Array,
        required: false
    }

}, { timestamps: true })


// - create the collection and export it
module.exports = mongoose.model("Post", PostSchema);