const router = require("express").Router();
const User = require('../models/User');


router.post("/",
    async (req, res) => {
        try {

            const userFound = await User.findOne({ sub: req.body.sub });

            if (!userFound) {
                // 1. create the object based on request
                const userObj = new User({
                    username: req.body.username,
                    email: req.body.email,
                    about: req.body.about,
                    linkedin: req.body.linkedin,
                    github: req.body.github,
                    sub: req.body.sub
                });

                // 2. save new
                const savedResponse = await userObj.save();
                res.status(200).json(savedResponse);

            } else {

                // 3. find by id and update
                const updatedUser = await User.findByIdAndUpdate(userFound._id,
                    {
                        $set: req.body
                    },
                    { new: true });
                res.status(200).json(updatedUser);
            }

        } catch (err) {
            console.log(err);
        }


    })


router.get("/:sub",
    async (req, res) => {
        try {

            // 1. find by sub
            const user = await User.findOne({ sub: req.params.sub });
            res.status(200).json(user);

        } catch (err) {
            console.log(err);

        }
    })



module.exports = router;