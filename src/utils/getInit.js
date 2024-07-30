// getInit.js
import {
  NEXT_PUBLIC_APP_ID,
  MIDDLEWARE_API_URL,
  XMIDDLEWARE_API_URL,
} from '@env';

export const clientInit = async (fetchWithTimeout, options) => {
  //sessionID, knowledgebaseId, lang
  options.appId = NEXT_PUBLIC_APP_ID;
  let initResponse;
  let error = null;
  let result;
  try {
    //NEXT_PUBLIC_APP_ID
    // requestBody supports OPENAI_API_KEY option too.. but then better create proxy api otherwise secret is visible...
    // const requestBody = { sessionID, knowledgebaseId, sourceLng: EVALS.contentLng, targetLng: lang }
    const requestBody = options;

    initResponse = await fetchWithTimeout(`${MIDDLEWARE_API_URL}init`, {
      method: 'POST',
      timeout: 25000,
      headers: {
        // 'Cache-Control': 'no-cache', ... Access to fetch at 'http://localhost:3330/api/v1/init' from origin 'http://localhost:3332' has been blocked by CORS policy: Request header field cache-control is not allowed by Access-Control-Allow-Headers in preflight response.
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },

      body: JSON.stringify(requestBody),
    });

    //console.log("INIT", initResponse);
    if (initResponse.ok) {
      result = await initResponse.json();

      console.log('get init  client init', result);
    } else {
      const err = await initResponse.text();
      console.error('RESPONSE ERROR ', err);
      error = Error(initResponse.statusText, {
        cause: {code: initResponse.status, info: err},
      });
    }
  } catch (err) {
    console.error(err);
    let errorName = err.name;
    if (err.name === 'AbortError') {
      errorName = 'OPENAI Timeout';
      error = Error(errorName, {
        name: err.name,
        cause: {code: 500, info: err},
      });
    }
  }
  // console.log("EXAMPLE RES END ", result);
  return {error, data: result};
};
