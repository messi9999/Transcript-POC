import AWS from 'aws-sdk';

// Configuration for AWS SDK
AWS.config.update({
  region: process.env.REACT_APP_AWS_REGION, // e.g., 'us-east-1'
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();

export default s3;
