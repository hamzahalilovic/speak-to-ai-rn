/* 

function getRandom() {
  // Weighted probabilities
  const probabilities = [0.5, 0.25, 0.25];

  // Get random number between 0 and 1
  const random = Math.random();
  console.log("Random number ", random);
  // Accumulate probabilities
  let accumulator = 0;
  for (let r = 0; r < probabilities.length; r++) {
    accumulator += probabilities[r];
    if (random < accumulator) {
      return r;
    }
  }
} */
//import { TextSplitter } from "./src/utils/textSplitter"
//import { text } from "./merikarvia";
import {text} from './prifina-ai';

const llm = 'gpt-3.5-turbo-instruct';

const url = 'https://api.openai.com/v1/completions';

import {OPENAI_API_KEY} from '@env';

async function aiRequest(payload) {
  let res;
  try {
    res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY ?? ''}`,
      },
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.log(err);
    //throw new Error(response.statusText);
  }

  //console.log("RES ", res);

  const result = await res.json();
  //console.log("RES ", result);
  if (
    result?.choices === undefined ||
    result?.choices === null ||
    result.choices.length === 0
  ) {
    console.log('AI RESPONSE ERROR ', result);
    //throw new Error();
  }
  return result.choices[0].text.trim();
}

export async function newQuestion() {
  // Get random integer between 1 and 999
  const min = 1;
  const max = 999;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  const option = randomNumber % 2 === 0;

  const parts = text.split('\n');

  // Generate random start index (0 to 5 inclusive)
  const start = Math.floor(Math.random() * 6);

  const end = 20 + Math.floor(Math.random() * 5); // Adjusted for 20-24 range

  // Slice the array to get the random subset of texts
  const randomTexts = parts.slice(start, end + 1); // +1 because slice's end is exclusive

  const prompt = `This is the text content enclosed by the <text> tag.
  
  <text>${randomTexts.join('\n')}</text>
  
  
  - Create short random ${
    option ? 'question' : 'request or instruction'
  } from the content.
  - It should be maximum 200 characters long.
  - Enclose question between <question> tag.`;
  const payload = {
    model: llm,
    prompt,
    temperature: 1,
    max_tokens: 200,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    seed: randomNumber,
  };

  /* 
    const promptData = {};
    promptData.model = llm;
    promptData.temperature = 1 - getRandomInteger(1, 4) / 10;
    promptData.max_tokens = 200;
    promptData.n = 1;
    promptData.seed = getRandomInteger(1, 9999);
    promptData.top_p = 0.6;
   */

  const result = await aiRequest(payload);
  console.log('RESULT QUESTION', result);
  const questionResult = result.match(/<question>(.*?)<\/question>/g);
  if (questionResult !== null && questionResult.length > 0) {
    const question = questionResult.map(match => {
      return match.replace(/<\/?question>/g, '');
    });

    //console.log("QUESTION ", question);

    return question;
  } else {
    return [];
  }
}

export async function newPIIQuestion() {
  // Get random integer between 1 and 999
  const min = 1;
  const max = 999;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  const option = randomNumber % 2 === 0;

  const prompt = `- Create short random ${
    option ? 'question' : 'request or instruction'
  }, which has PII informations..
  - It should be maximum 200 characters long.
  - Enclose question between <question> tag.`;
  const payload = {
    model: llm,
    prompt,
    temperature: 1,
    max_tokens: 200,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    seed: randomNumber,
  };

  /* 
    const promptData = {};
    promptData.model = llm;
    promptData.temperature = 1 - getRandomInteger(1, 4) / 10;
    promptData.max_tokens = 200;
    promptData.n = 1;
    promptData.seed = getRandomInteger(1, 9999);
    promptData.top_p = 0.6;
   */

  const result = await aiRequest(payload);
  console.log('RESULT QUESTION', result);
  const questionResult = result.match(/<question>(.*?)<\/question>/g);
  if (questionResult !== null && questionResult.length > 0) {
    const question = questionResult.map(match => {
      return match.replace(/<\/?question>/g, '');
    });

    //console.log("QUESTION ", question);

    return question;
  } else {
    return [];
  }
}

export async function followUpQuestion(previousAnswer) {
  // Get random integer between 1 and 999
  const min = 1;
  const max = 999;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  const option = randomNumber % 2 === 0;

  const parts = text.split('\n');

  // Generate random start index (0 to 5 inclusive)
  const start = Math.floor(Math.random() * 6);

  const end = 20 + Math.floor(Math.random() * 5); // Adjusted for 20-24 range

  // Slice the array to get the random subset of texts
  const randomTexts = parts.slice(start, end + 1); // +1 because slice's end is exclusive

  const prompt = `This is the text content enclosed by the <text> tag.
  
  <text>${randomTexts}</text>

  This is the previous answer enclosed by the <answer> tag.

  <answer>${previousAnswer}</answer>
  
  - Create short followup ${
    option ? 'question' : 'request or instruction'
  } using both previous answer and the text content.
  - It should be maximum 200 characters long.
  - Enclose question between <question> tag.`;
  const payload = {
    model: llm,
    prompt,
    temperature: 1,
    max_tokens: 200,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    seed: randomNumber,
  };

  const result = await aiRequest(payload);
  console.log('RESULT FOLLOWUP', result);
  const questionResult = result.match(/<question>(.*?)<\/question>/g);
  if (questionResult !== null && questionResult.length > 0) {
    const question = questionResult.map(match => {
      return match.replace(/<\/?question>/g, '');
    });

    //console.log("QUESTION ", question);

    return question;
  } else {
    return [];
  }
}
/* 
async function main() {
  //newQuestion();
  const question = [
    'What is the population of Merikarvia and what is its main source of income?'
  ];
  const answer = 'Merikarvia has a population of 2,967 as of December 31, 2023. Historically, the municipality largely relied on activities related to the sea, such as fishing, sawmills, and shipyards, as its main sources of income.';
  const followUP = await followUpQuestion(answer);
  console.log("FOLLOWUP ", followUP);
}
main(); */
