const router = require("express").Router();
const Comment = require('../models/Comment');


// CREATE 
router.post("/", async (req, res) => {

    try {
        // 1. create comments
        const newComments = await Comment.create(req.body);
        // 2. try save
        Comment.updateOne(newComments, { upsert: true });
        res.status(200).json(newComments);

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
// get all categories
router.get("/",
    async (req, res) => {
        try {
            const comments = await Comment.find();
            res.status(200).json(comments);
        } catch (err) {
            res.status(404).json("Comments doesn't exists");
        }
    })



module.exports = router;