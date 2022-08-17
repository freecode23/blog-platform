const router = require("express").Router();
const User = require('../models/User');
const bcrypt = require("bcrypt");

// Register: api/auth/register
router.post("/register",
    async (req, res) => {
        try {

            const salt = await bcrypt.genSalt(10);
            const hashedPass = await bcrypt.hash(req.body.password, salt);

            // 1. create new user
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashedPass
            });

            // 2. save
            const user = await newUser.save();
            res.status(200).json(user);

        } catch (err) {
            res.status(500).json(err);
        }
    })


// login
router.post("/login",
    async (req, res) => {
        try {

            // 1. find the user in db using the email provided
            const user = await User.findOne({ email: req.body.email });
            // !user && res.status(400).json("Wrong credentials");

            // 2. compare password
            const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);

            // 3. get user's field but password. we cannot take user's property directly have to use ._doc
            const { password, ...others } = user._doc;

            if (!user) {
                res.status(400).json("Wrong credentials")
            } else if (!isPasswordMatch) {
                res.status(400).json("Wrong credentials")

            } else {
                // 4. return the user's other properties as json
                res.status(200).json(others);
            }

        } catch (err) {
            res.status(500).json(err);
        }
    })

module.exports = router;