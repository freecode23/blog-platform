const router = require("express").Router();
const Category = require('../models/Category');


// CREATE 
router.post("/", async (req, res) => {
    try {
        // 1. create category
        const newCat = await Category.create(req.body);

        // 2. try save
        Category.updateOne(newCat, { upsert: true });
        res.status(200).json(newCat);

    } catch (err) {
        // >>>>>>>>>>repeat handler
        if (err.code && err.code == 11000) { // - Handle duplicate caregory
            for (var key in err.keyValue) {
                const message = `The category with ${key}: "${err.keyValue[key]}" already exist`
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
            const categories = await Category.find();
            res.status(200).json(categories);
        } catch (err) {
            res.status(404).json("Category doesn't exists");
        }
    })



module.exports = router;