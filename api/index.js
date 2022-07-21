require("dotenv").config();
const express = require("express");

const app = express();
const path = require("path");
const mongoose = require("mongoose");

// aws and multer
const cors = require("cors");
const multer = require("multer");
const aws = require('aws-sdk')
const multerS3 = require('multer-s3')
const bodyParser = require("body-parser")

// import router
const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");
const postsRoute = require("./routes/blogposts");
const categoriesRoute = require("./routes/categories");
const FroalaEditor = require('./node_modules/wysiwyg-editor-node-sdk/lib/froalaEditor.js');

app.use(cors());
app.use(express.json()); // allow to send JSON object to route
app.use("/images", express.static(path.join(__dirname, "/images"))); // make images folder public

// 2. DB
mongoose
    .connect(process.env.MONGO_URL)
    .catch((err) => console.log(err));


// 3. AWS 
// aws config
aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-2'
});
const s3=new aws.S3();

// aws froala >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// get signature so we can upload from froala
app.get('/api/get_signature', function (req, res) {
    const froalaS3Configs = {
        // The name of your bucket.
        bucket: process.env.AWS_BUCKET_NAME,

        // S3 region. If you are using the default us-east-1, it this can be ignored.
        region: 'us-east-2',

        // The folder where to upload the images.
        keyStart: 'uploads',

        // File access.
        acl: 'public-read',

        // AWS keys.
        accessKey: process.env.AWS_ACCESS_KEY_ID,
        secretKey: process.env.AWS_SECRET_ACCESS_KEY
    }

  const s3Hash = FroalaEditor.S3.getHash(froalaS3Configs);
//   console.log("get_signature s3hash", s3Hash);
  res.send(s3Hash);
});

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// 4. multer local storage
// const storage = multer.diskStorage({
//     // save file inside our api images folder
//     destination: (req, file, callback) => {
//         callback(null, "images")
//     },

//     // the file name will be the name provided by the request body
//     filename: (req, file, callback) => {
//         callback(null, req.body.name) // replace with req.body.name
//     }
// })
// const upload = multer({ storage: storage });

// 4. multer s3 storage
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: 'public-read',
        Key: function (req, file, cb) {

            // Question 1: why is it now going here
            // console.log("small K");
            // console.log("multer request>>>" , req);
            console.log("\nreq.body:name", req.body.name);
            // console.log("file multers3:\n", file);
            cb(null, req.body.name); 
        },

    })
});

// 5. create upload image route
app.post("/api/upload", 
    // - upload the file to s3
    upload.single("file"), 

    // - send back the file location as response
    // link: https://myblogs3bucket.s3.us-east-2.amazonaws.com/8cf10b9a45e9b14322b7b3b26fab5dfe'
    // key: 8cf10b9a45e9b14322b7b3b26fab5dfe
    (req, res) => {
        res.json({ link: req.file.location,
                    key: req.file.key
         }) 
    })


app.post("/api/download_resume",
    async (req, res) =>  {
        // Question 2: Why there is no request body. it should show the user data key
        console.log("req>>>>", req.body);

        try {
            const url = await s3.getSignedUrl('getObject', {
                Bucket: process.env.AWS_BUCKET_NAME,
                // TODO change key here with req.body key
                Key: '77e4c8d9dd50119cc0c5babace99cdd0', 
                Expires: 60 * 5
            })
            res.status(200).json(url);
        } catch (err) {
            console.log(err);
        }
    }
)

// 4. use router
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/blogposts", postsRoute);
app.use("/api/categories", categoriesRoute);


app.listen(4000, () => {
    console.log("back end running");
})