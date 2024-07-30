// awsConfig.js
import AWS from 'aws-sdk';
import {
  MY_ACCESS_KEY,
  MY_SECRET_KEY,
  MY_REGION,
  SQS_URL,
  AI_BUCKET,
} from '@env';

// Set the AWS configuration
AWS.config.update({
  accessKeyId: MY_ACCESS_KEY,
  secretAccessKey: MY_SECRET_KEY,
  region: MY_REGION,
});

// Create instances for specific AWS services
const SQS = new AWS.SQS({apiVersion: '2012-11-05'});
const S3 = new AWS.S3({apiVersion: '2006-03-01'});

// Export the configured AWS services and config
export {SQS, S3, AWS};
