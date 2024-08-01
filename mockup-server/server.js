// server.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import {GPTTokens} from 'gpt-tokens';
import {
  example,
  streamResponse,
  detect,
  extractFeature,
  getChunks,
  generateAnswer,
  init,
  navigate,
} from './responses.js';
import {johanna, jouko, markus} from './aiCollection.js';

const app = express();
const PORT = 3001;

// Middleware to handle JSON body parsing
app.use(bodyParser.json());

// Middleware to enable CORS for a specific origin
app.use(
  cors({
    origin: 'http://localhost:8081', // Adjust this to your front-end server's address
  }),
);

// Define API endpoints with mock responses
app.post('/api/v1/examples', (req, res) => {
  res.status(200).json(example);
});

app.post('/api/v1/detect', (req, res) => {
  res.status(200).json(detect);
});

app.post('/api/v1/extract-feature', (req, res) => {
  res.status(200).json(extractFeature);
});

app.post('/api/v1/get-chunks', (req, res) => {
  res.status(200).json(getChunks);
});

app.post('/api/v1/init', (req, res) => {
  res.status(200).json(init);
});

app.post('/api/v1/generate', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.write(streamResponse);
  res.end('');
});

app.post('/api/v1/generate-v2', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.write(streamResponse);
  res.end('');
});

app.post('/api/v1/navigate', (req, res) => {
  res.status(200).json(navigate);
});

// Define the /updateUsedTokens endpoint
app.post('/api/v1/updateUsedTokens', (req, res) => {
  const {
    userId,
    requestId,
    followUp,
    aggregate,
    entryType,
    langCode,
    session,
    statement,
    llm,
    answer,
    score,
    tokens,
    currentIndex,
    finish_reason = null,
  } = req.body;

  console.log('LOG UPDATE START ', new Date().toISOString());
  const logEvent = {
    [requestId]: {
      SESSION_ID: session,
      APP_ID: process.env.APP_ID,
      INDEX_ID: currentIndex,
      USER_ID: userId || 'XXXXXXXX',
    },
  };

  console.log(`###_SESSION_ID= ${session}`);
  console.log(`###_INDEX_ID= ${currentIndex}`);
  console.log(`###_REQUEST_ID= ${requestId}`);

  let usageInfo = undefined;
  if (typeof answer === 'undefined') {
    console.log(`###_INIT_STATEMENT= ${statement}`);
    console.log(`###_ENTRY_TYPE= ${entryType}`);
    console.log(`###_ENTRY_LANG= ${langCode}`);
    logEvent[requestId]['ENTRY_TYPE'] = entryType;
    logEvent[requestId]['ENTRY_LANG'] = langCode;
    logEvent[requestId]['INIT_STATEMENT'] = statement;

    if (followUp) {
      console.log(`###_FOLLOWUP= OK`);
      logEvent[requestId]['FOLLOWUP'] = true;
    }
    if (aggregate) {
      console.log(`###_AGGREGATE= OK`);
      logEvent[requestId]['AGGREGATION'] = true;
    }
  }
  if (answer && answer.length > 0) {
    usageInfo = new GPTTokens({
      model: llm,
      messages: [{role: 'assistant', content: answer}],
    });

    console.log(`###_ANSWER_TOKENS=${usageInfo.usedTokens}`);
    console.log(`###_SCORE= ${score}`);
    console.log(`###_END_STATEMENT= ${statement}`);
    console.log(`###_ANSWER= ${answer}`);
    console.log(`###_TOTAL_TOKENS= ${tokens + usageInfo.usedTokens}`);

    logEvent[requestId]['ANSWER_TOKENS'] = usageInfo.usedTokens;
    logEvent[requestId]['SCORE'] = score;
    logEvent[requestId]['END_STATEMENT'] = statement;
    logEvent[requestId]['ANSWER'] = answer;
    logEvent[requestId]['TOTAL_TOKENS'] = tokens + usageInfo.usedTokens;
  }
  if (finish_reason) {
    console.log(`###_FINISH_REASON= ${finish_reason}`);
    logEvent[requestId]['FINISH_REASON'] = finish_reason;
  }

  console.log('###_LOG_EVENT= ', JSON.stringify(logEvent));
  console.log('LOG UPDATE END ', new Date().toISOString());

  res.status(200).json({response: {tokens: usageInfo?.usedTokens || 0}});
});


app.post('/api/v1/navigatevalto', (req, res) => {
  res.status(200).json(navigate);
});
app.post('/api/v1/navigatemarkus', (req, res) => {
  res.status(200).json(markus);
});
app.post('/api/v1/navigatejouko', (req, res) => {
  res.status(200).json(jouko);
});
app.post('/api/v1/navigatejohanna', (req, res) => {
  res.status(200).json(johanna);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
