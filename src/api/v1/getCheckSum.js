import NextCors from 'nextjs-cors';
import CryptoJS from 'crypto-js';
import {MY_SECRET_KEY} from '@env';

const generateChecksum = data => {
  return CryptoJS.MD5(JSON.stringify(data)).toString();
};

const decryptChecksum = (encryptedChecksum, secretKey) => {
  const bytes = CryptoJS.AES.decrypt(encryptedChecksum, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

const encryptChecksum = (checksum, secretKey) => {
  return CryptoJS.AES.encrypt(checksum, secretKey).toString();
};

export default async function handler(req, res) {
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  if (req.method !== 'POST') {
    //res.status(400).json({ error: 'Invalid method, only POST allowed!' });
    //return;
    return new Response(
      JSON.stringify({error: 'Invalid method, only POST allowed!'}),
      {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }

  const body = req.body;

  const secretKey = MY_SECRET_KEY;
  const checksum = generateChecksum(body);
  const encryptedChecksum = encryptChecksum(checksum, secretKey);

  res.status(200).json({response: encryptedChecksum});
}
