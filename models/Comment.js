const mongoose = require("mongoose");


//- create interface / schema
const CommentSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Cannot add a comment without username"],
    },
    content: {
        type: String,
        required: [true, "Cannot add a comment without the comment itself!"],
    },
    postId: {
        type: String,
        required: [true, "Cannot add a comment without belonging to a post!"],
    }

}, { timestamps: true })


// - create the collection and export it
module.exports = mongoose.model("Comment", CommentSchema);