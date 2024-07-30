import {S3Client, PutObjectCommand, GetObjectCommand} from '@aws-sdk/client-s3';
import {Buffer} from 'buffer';

const config = {
  credentials: {
    accessKeyId: process.env.MY_ACCESS_KEY,
    secretAccessKey: process.env.MY_SECRET_KEY,
  },
  region: process.env.MY_REGION,
};

const s3Client = new S3Client(config);
//console.log("S3 config ", config);

// Utility function to convert a readable stream to a string
async function streamToString(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('base64')));
  });
}

export const saveBase64Image = async (base64Image, image) => {
  // Split the base64 string into the header and the data
  const [metadata, imageData] = base64Image.split(',');

  // Extract the MIME type and file extension from the metadata
  const mimeType = metadata.match(/data:(.*);base64/)[1];
  const fileExtension = mimeType.split('/')[1];

  // Create a buffer from the base64 image data
  const imageBuffer = Buffer.from(imageData, 'base64');

  const key = `avatars/${image}.${fileExtension}`; // The path and file name in the S3 bucket

  const uploadParams = {
    Bucket: SPEAK_TO_CDN,
    Key: key,
    Body: imageBuffer,
    ContentType: mimeType, // Set the content type to the MIME type of the image
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(uploadParams));
    // console.log('Image uploaded successfully:', data);
    return mimeType;
  } catch (err) {
    console.error('Error', err);
    // Rethrow the error to ensure it is captured...
    throw err;
  }
};

export const getBase64Image = async (image, mimeType) => {
  const fileExtension = mimeType.split('/')[1];

  const key = `avatars/${image}.${fileExtension}`; // The path and file name in the S3 bucket

  const downloadParams = {
    Bucket: SPEAK_TO_CDN,
    Key: key,
  };

  // Download the image from the S3 bucket and convert it to a
  try {
    const data = await s3Client.send(new GetObjectCommand(downloadParams));
    const base64Image = await streamToString(data.Body);
    const mimeType = data.ContentType; // Get the content type from the response metadata
    const base64EncodedImage = `data:${mimeType};base64,${base64Image}`;
    //console.log('Base64 encoded image:', base64EncodedImage);
    return base64EncodedImage;
  } catch (err) {
    console.error('Error', err);
    // Rethrow the error to ensure it is captured...
    throw err;
  }
};
