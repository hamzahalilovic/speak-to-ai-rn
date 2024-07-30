// server.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import {getUserKnowledgebase, getUser} from './dynamoDB.js';
import {saveBase64Image, getBase64Image} from './s3.js';
import {isValidUUID} from './utils.js';

import {updateUsedTokens} from './getAnswer.js';
import {testUser} from './testUser.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/navigate', async (req, res) => {
  const {currentUrl} = req.body;
  const name = currentUrl.split('/').pop();

  try {
    let data = {};
    if (isValidUUID(name)) {
      const user = await getUserKnowledgebase(name);
      if (user.Items && user.Items.length > 0) {
        data = user.Items[0];
        data['test-mode'] = true;
      } else {
        return res.status(400).json({message: `Unknown ${name}`});
      }
    } else {
      if (process.env.NEXT_PUBLIC_APP_DEV === 'true') {
        data = testUser;
      } else {
        const user = await getUser(name);
        if (!user?.Item) {
          return res.status(400).json({message: `Unknown ${name}`});
        } else {
          data = user.Item;
          data['test-mode'] = false;
        }
      }
    }

    if (data.mimeType) {
      const fileExtension = data.mimeType.split('/')[1];
      data[
        'avatar-url'
      ] = `https://s3.${process.env.MY_REGION}.amazonaws.com/${process.env.SPEAK_TO_CDN}/avatars/${name}.${fileExtension}`;
      data['avatar'] = await getBase64Image(name, data.mimeType);
    } else {
      await saveBase64Image(data.avatar, name);
      const mimeType = data['avatar'].match(/data:(.*);base64/)[1];
      const fileExtension = mimeType.split('/')[1];
      data[
        'avatar-url'
      ] = `https://s3.${process.env.MY_REGION}.amazonaws.com/${process.env.SPEAK_TO_CDN}/avatars/${name}.${fileExtension}`;
    }

    res.status(200).json({result: {...data, name}});
  } catch (err) {
    console.log('Error', err);
    res.status(500).json({error: err});
  }
});
console.warn('ss', process.env.MY_REGION);
app.post('/updateUsedTokens', async (req, res) => {
  try {
    const result = await updateUsedTokens(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.log('Error', err);
    res.status(500).json({error: err});
  }
});

app.listen(3003, () => {
  console.log('Server is running on port 3003');
});
