const router = require("express").Router();
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const bcrypt = require("bcrypt");
const s3 = require("../config")
require("dotenv").config();


const handleError = (res, err) => {
    const messages = []
    for (var key in err.errors) {
        var message = ""
        if (key === "picture") {
            message = "Check if blogpost picture exist"
        } else if (key === "content") {
            message = "Check if content exists"
        } else if (key === "title") {
            message = "Check if title exists"
        }
        messages.push(message)
    }
    console.log("messages=", messages.join("\n"))
    res.status(500).json({ message: messages.join("\n") });

    // // - handle missing property of the post
    // if (err.stringValue && err.path === "content") {
    //     message = "Make sure updated content exists"
    //     res.status(500).json({ message: message });

    // } else if (err.errors) {
    //     if (err.errors.content && err.errors.content.stringValue === "\"{ model: '' }\"") {
    //         message = "Make sure content exists"
    //         res.status(500).json({ message: message });
    //     } else {
    //         console.log("some error>>>")
    //         for (var key in err.errors) {
    //             message = err.errors[key].properties.message
    //         }
    //         res.status(500).json({ message: message });
    //     }
    // } else if (err.code && err.code == 11000) { // - Handle duplicate post
    //     for (var key in err.keyValue) {
    //         const message = `The post with ${key}: "${err.keyValue[key]}" already exist`
    //         res.status(500).json({ message: message });
    //     }
    // } else {
    //     res.status(500).json({ message: "please check all of your fields" });
    // }
}

// CREATE 
router.post("/", async (req, res) => {
    try {
        // 1. create post
        const newPost = await Post.create(req.body);
        // 2. try save
        const post = await newPost.save();
        res.status(200).json(post);

    } catch (err) {
        handleError(res, err)
    }
})


// READ
router.get("/:id",
    async (req, res) => {
        // 1. check if the request comes from the same user in params
        try {
            const post = await Post.findById(req.params.id);
            res.status(200).json(post);

        } catch (err) {
            res.status(404).json("Post doesn't exists");
        }
    })

// get all posts by user, category or all
// "/?user="
router.get("/",
    async (req, res) => {
        const username = req.query.user;
        const categoryName = decodeURI(req.query.cat)

        try {
            let posts;
            if (username) { // fetch post by username
                posts = await Post.find({ username: username });

            } else if (categoryName && categoryName != 'undefined') { // fetch post by category name
                posts = await Post.find({
                    categories: {
                        $in: [categoryName]
                    }
                });

            } else { // fetch all post
                posts = await Post.find();
            }
            res.status(200).json(posts);

        } catch (err) {
            res.status(404).json("Post doesn't exists");
        }
    })


// UPDATE
router.put("/:id",
    async (req, res) => {

        try {
            // 1. find the post to be updated
            const post = await Post.findById(req.params.id);

            // 2. if the post user name is current user
            if (post.username === req.body.username) {
                // update
                const updatedPost = await Post.findByIdAndUpdate(
                    req.params.id,
                    { $set: req.body },
                    { new: true, runValidators: true });
                res.status(200).json(updatedPost);

            } else {
                res.status(401).json("You can only update your own post");
            }

        } catch (err) {
            handleError(res, err)
        }

    })


// DELETE
router.delete("/:id",
    async (req, res) => {
        try {
            // 1. find the post to be deleted
            const post = await Post.findById(req.params.id);

            // 2. delete the post
            await post.delete();

            // 3. delete comments of this postid
            await Comment.deleteMany({ "postId": `${req.params.id}` })

            // 4. delete big picture from s3
            s3.deleteObject({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: post.picture
            }, function (err, data) {
                res.status(500).json(err);
            })

            // 5. delete object fro froala
            post.pictures.forEach((pictureKey, idx) => {
                s3.deleteObject({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: pictureKey

                }, function (err, data) {
                    res.status(500).json(err);
                })

            })
            res.status(200).json(`post comments:\n ${post.comments}`);

        } catch (err) {
            res.status(500).json(err);
        }

    })




module.exports = router;