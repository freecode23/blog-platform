const aws = require('aws-sdk')

// 3. AWS 
// aws config
aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-2'
});
const s3 = new aws.S3();



module.exports = s3