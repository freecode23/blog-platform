const router = require("express").Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');


// CREATE 
router.post("/:id", async (req, res) => {
    try {
        // 1. create comments
        const newComment = await Comment.create(req.body);

        // 2. try save comment
        Comment.updateOne(newComment, { upsert: true });

        // 3. get post from databse
        const blogPost = await Post.findById(req.params.id);

        // 4. push comment to the post 
        blogPost.comments.push(newComment)

        // 5. update
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            blogPost,
            { new: true, runValidators: true });
        res.status(200).json(updatedPost);


    } catch (err) {
        // >>>>>>>>>>repeat handler
        if (err.code && err.code == 11000) { // - Handle duplicate caregory
            for (var key in err.keyValue) {
                const message = `The comment with ${key}: "${err.keyValue[key]}" already exist`
                res.status(500).json({ message: message });
            }
        } else {
            res.status(500).json({ message: "please check all of your fields" });
        }
        // <<<<<<<<<<<<<<<<<<<<<<<<
    }
})


// READ
// get all comments
router.get("/",
    async (req, res) => {
        console.log("hitting comments api")
        try {
            const comments = await Comment.find();
            res.status(200).json(comments);
        } catch (err) {
            res.status(404).json("Comments doesn't exists");
        }
    })



module.exports = router;