import {fetchWithTimeout} from '../utils';
import {MIDDLEWARE_API_URL, OPENAI_API_KEY} from '@env';

function customDeserialize(str) {
  // console.log("DESERIALIZE ", str);
  const obj = {};
  str.split(';').forEach(pair => {
    const [key, value] = pair.split('=');
    try {
      // Decode each part safely
      obj[decodeURIComponent(key)] = decodeURIComponent(value);
    } catch (e) {
      console.error('Failed to decode URI component', e);
      // Handle or log the error, or assign a default value
      obj[key] = value; // Optionally keep the original undecoded value
    }
  });
  return obj;
}

/* 
function customDeserialize(str) {
  console.log("DESERIALIZE ", str);
  //text=%20around;finish_reason=null
  const obj = {};
  str.split(';').forEach(pair => {
    const [key, value] = pair.split('=').map(decodeURIComponent);
    obj[key] = value;
  });
  return obj;
} */

// const getStreamAnswer = async (data, chatId, update = false) => {
//   console.log('STREAM DATA', data);
//   const reader = data.getReader();

//   console.log('STREAM READER', reader);

//   const decoder = new TextDecoder();
//   let done = false;
//   if (!update) {
//     document.getElementById(chatId).querySelector('.dots').style.display =
//       'none';
//   }
//   const element = document
//     .getElementById(chatId)
//     .querySelector('.question-answer');
//   if (update) {
//     element.innerHTML += ' ';
//   }

//   let answer = '';
//   let finish_reason = null;
//   while (!done) {
//     const {value, done: doneReading} = await reader.read();
//     done = doneReading;
//     //console.log("STREAM VALUE ", decoder.decode(value));
//     /*
//    STREAM VALUE  text=-;finish_reason=null
// text=%20Outdoor;finish_reason=null
// text=%20activities;finish_reason=null
//     */

//     let chunkValue = decoder.decode(value);
//     if (value !== '') {
//       const chunks = chunkValue.split('\n');
//       if (chunks.length > 0) {
//         //console.log("CHUNKS ", chunks);

//         const deserialized = chunks
//           .filter(c => c !== '')
//           .map(chunk => JSON.stringify(customDeserialize(chunk)))
//           .map(str => JSON.parse(str));
//         //console.log(deserialized, deserialized.length);
//         if (deserialized.length > 0) {
//           chunkValue = '';
//           deserialized.forEach(c => {
//             finish_reason = c.finish_reason;
//             if (c.text !== undefined) {
//               chunkValue += c.text;
//             }
//           });
//         }
//       }
//       // finish_reason = chunk.finish_reason;
//       // streamValue = chunk.text;
//     }

//     //const chunkValue = decoder.decode(streamValue);
//     const text = chunkValue.replaceAll('\n', '<br/>');
//     //console.log("TEXT ", text, new Date().toISOString());
//     element.innerHTML += text;

//     const scrollHere = document.getElementById('scroll-marker');
//     scrollHere.scrollIntoView(true, {
//       behavior: 'smooth',
//       block: 'end',
//       inline: 'nearest',
//     });
//     answer += text;
//   }

//   console.log(
//     'STREAM RESPONSE ',
//     answer,
//     finish_reason,
//     new Date().toISOString(),
//   );
//   return Promise.resolve({answer, finish_reason});
// };

const getStreamAnswer = async (data, updateUI) => {
  console.log('STREAM DATA', data);
  let done = false;

  let answer = '';
  let finish_reason = null;

  // Simulate the reader and decoding process since the data is already provided
  while (!done) {
    const value = await data;
    done = true; // Since data is already complete
    console.log('value await data', value);

    let chunkValue = value;
    console.log('chunk value', chunkValue);
    if (value !== '') {
      const chunks = chunkValue.split('\n');
      if (chunks.length > 0) {
        const deserialized = chunks
          .filter(c => c !== '')
          .map(chunk => JSON.stringify(customDeserialize(chunk)))
          .map(str => JSON.parse(str));

        if (deserialized.length > 0) {
          chunkValue = '';
          deserialized.forEach(c => {
            finish_reason = c.finish_reason;
            if (c.text !== undefined) {
              chunkValue += c.text;
            }
          });
        }
      }
    }

    const text = chunkValue.replaceAll('\n', '<br/>');
    console.log('Processed text', text);

    // Update the UI with the processed text
    // updateUI(text);
    console.log('hehehe', text);
    answer += text;
  }

  console.log(
    'STREAM RESPONSE ',
    answer,
    finish_reason,
    new Date().toISOString(),
  );
  return Promise.resolve({answer, finish_reason});
};

export const getHistory = (
  tokens,
  maxTokens,
  queryResult,
  allItems,
  currentTopic,
) => {
  const history = [];

  //historyContent.push({ role: "user", content: lastItem.metadata.entry });
  //historyContent.push({ role: "assistant", content: lastItem.metadata.answer });

  let addedTokens = 0;
  let itemIndex = [];
  // first include all which match well with the entry...
  const sourceContent = [];
  for (let h = 0; h < queryResult.length; h++) {
    const item = queryResult[h].item;
    if (tokens + addedTokens + item.metadata.tokens < maxTokens) {
      itemIndex.push(item.metadata.index);
      addedTokens += item.metadata.tokens;
      //history.push(item.text);
      if (item.metadata?.source === undefined) {
        if (item.metadata.entry !== '') {
          history.push({role: 'user', content: item.metadata.entry});
        }
        if (item.metadata.answer !== '') {
          history.push({role: 'assistant', content: item.metadata.answer});
        }
      } else {
        sourceContent.push(item.metadata);
      }
    }
  }
  // console.log("SOURCE ", JSON.stringify(sourceContent, true, 1));
  if (sourceContent.length > 0) {
    const topics = {};
    sourceContent.forEach(meta => {
      if (!topics[meta.source]) {
        topics[meta.source] = {};
      }
      if (!topics[meta.source][meta.topic]) {
        topics[meta.source][meta.topic] = [];
      }
      topics[meta.source][meta.topic].push(meta);
    });
    //console.log("TOPICS ", JSON.stringify(topics, true, 1));
    Object.keys(topics).forEach(source => {
      Object.keys(topics[source]).forEach(topic => {
        //console.log("SOURCE ", topic, source);
        if (source === 'web') {
          const page = [];

          if (topics[source][topic][0]?.keywords !== undefined)
            page.push(
              `Page keywords are: ${topics[source][topic][0].keywords}.`,
            );
          if (topics[source][topic][0]?.description !== undefined)
            page.push(
              `Page description is: ${topics[source][topic][0].description}.`,
            );
          if (topics[source][topic][0]?.title !== undefined)
            page.push(`Page title is: ${topics[source][topic][0].title}.`);

          topics[source][topic].forEach(item => {
            page.push(item.entry);
          });
          history.push({role: 'user', content: page.join(' ')});
        }
      });
    });
  }
  /* 
  // include also all same topic... and set the default topic to the best match...
  if ((tokens + addedTokens) < maxTokens) {

    for (let i = 0; i < allItems.length; i++) {
      const item = allItems[i];
      if ((tokens + addedTokens + item.metadata.tokens) < maxTokens) {
        if (item.metadata.topic === currentTopic && itemIndex.findIndex(h => h === item.metadata.index) < 0) {
          addedTokens += item.metadata.tokens;
          itemIndex.push(item.metadata.index);
          //history.push(item.text);
          if (item.metadata.entry !== "") {
            history.push({ role: "user", content: item.metadata.entry });
          }
          history.push({ role: "assistant", content: item.metadata.answer });
        }
      }
    }
  }
 */

  console.log('HISTORY ', history);

  return history;
};

export const updateUsedTokens = async ({url, ...opts}) => {
  console.log('update tokens url', url);

  // proxy api, which outputs info to app logs.
  const tokens = await fetch(`${url}/updateUsedTokens`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
    body: JSON.stringify(opts),
  });

  let tokendata = {};
  if (tokens.ok) {
    tokendata = await tokens.json();
  }

  return Promise.resolve(tokendata);
};

export const scoreInfo = (avgScore, scoreLimit) => {
  let update = {};
  if (avgScore < scoreLimit + 0.3) {
    if (avgScore === 0) {
      update.details =
        'There are no results that match your search criteria. Please try different keywords or broadening your search.';
      update.info = 'alert-color';
    }

    if (avgScore > 0 && avgScore < scoreLimit + 0.1) {
      //0.3
      update.details =
        'More details could help improve the answer. Please provide additional context or clarification.';
      update.info = 'warning-color';
    }
    if (avgScore > 0 && avgScore >= scoreLimit + 0.1) {
      //0.3
      update.details =
        'The answer can be improved by adding more details to the question.';
      update.info = 'info-color';
    }
  } else {
    update.details =
      'Your query provided good results from the available content.';
    update.info = 'good-color';
  }
  return update;
};

const makeRequest = async (requestOptions, url) => {
  let requestResponse = undefined;
  try {
    requestResponse = await fetchWithTimeout(
      `${MIDDLEWARE_API_URL}generate-v2`,
      requestOptions,
    );

    console.log('make request url', `${MIDDLEWARE_API_URL}generate-v2`);
    console.log('make request requestOptions', requestOptions);

    const data = await requestResponse.text(); // Ensure the response body is read as text
    console.log('NEW REQ DATA', data);

    return {error: null, data};
  } catch (err) {
    console.log('OPENAI ERROR', err);
    console.error(err);
    let error;
    let errorName = err.name;
    if (err.name === 'AbortError') {
      errorName = 'OPENAI Timeout';
      error = Error(errorName, {
        name: errorName,
        cause: {code: 500, info: err},
      });
    } else {
      const requestErr = await requestResponse.text();
      error = Error(requestResponse.statusText, {
        cause: {code: requestResponse.status, info: requestErr},
      });
    }

    return {error};
  }
};

export const aiAnswer = async ({url, entryType, langCode, ...opts}) => {
  console.log('ai answer url', url);
  console.log('ai answer props', entryType, langCode);
  console.log('ai answer opts', opts);

  // const options = {
  //   requestId: '8ce0d9e4-93d4-4970-a794-a55a09af9449',
  //   lastEntry: {},
  //   aggregate: false,
  //   followUp: false,
  //   statement:
  //     'How can individuals leverage AI assistants and personal data management to enhance their daily interactions and experiences in the evolving digital landscape?',
  //   llm: 'gpt-3.5-turbo-1106',
  //   history: [],
  //   chunks: [
  //     {
  //       chunk:
  //         "Remember, it's about the information user experience. How do we interact with information? And yes, every Christmas, we still come together with our friends, have dinner, and play with new toys. Data clouds with AI interfaces simplify architecture for managing information, whether for individuals, companies, or other entities. This is about saving, retrieving, and communicating information, improving both the user interface and the data per object approach. So, what can you do? The technology is here and affordable. As an individual, you can start with Pri-AI and AI buddies. You can join our waiting list as we release this gradually to ensure scalability. You can have your own AI assistants pre-installed, install new ones, remove them, or even create your own. For example, have one assistant manage all your recipes for cooking or install ones created by others with specific knowledge.",
  //       score: 0.6826679332331488,
  //       metadata: {
  //         loc: {lines: {from: 278, to: 282}},
  //         source: 'speak-to-hub',
  //         totalPages: 1,
  //         file: 'id-1712306089665-a03ed24dd02ae.txt',
  //         date: 1712306105418,
  //         tokens: 181,
  //         plans: 0,
  //         language: 'en',
  //         groupId: '5f8be908-3ef1-45bf-a370-992a67607f7c',
  //       },
  //     },
  //     {
  //       chunk:
  //         'Everything in our life can now have a data cloud, and most importantly, because this technology is capable and affordable today. If we can do it at an individual level, you can imagine how cost-effective that is to do at a company and business level. So, by far, we have the capabilities to also build the most human-centric user interfaces. With AI, any data can come to life as a digital persona. You can simply talk with your data, like the example I gave: "Hey, AI, how did I sleep last night?" So, that data exists in my data cloud, and I can ask that question and get a verbal answer. How long I was in bed, how many hours I slept, how much deep sleep, what was my readiness score, and so forth. You can talk with an application, you can talk with a company, you can talk with your car, house, pet, and so forth. You can make its appearance as you like. You can have it human-like appearance because that\'s the most convenient way to understand how to communicate with it.',
  //       score: 0.6799736854590451,
  //       metadata: {
  //         loc: {lines: {from: 212, to: 230}},
  //         source: 'speak-to-hub',
  //         totalPages: 1,
  //         file: 'id-1712306089665-a03ed24dd02ae.txt',
  //         date: 1712306105163,
  //         tokens: 227,
  //         plans: 0,
  //         language: 'en',
  //         groupId: '5f8be908-3ef1-45bf-a370-992a67607f7c',
  //       },
  //     },
  //     {
  //       chunk:
  //         "Digital Entrepreneurship: The pursuit of creating new ventures or transforming existing businesses by leveraging digital technologies. It involves innovating digital products, services, or platforms that offer unique value propositions. AI Buddies: AI assistants provided by Prifina via the Pri-AI interface, running from users' private data clouds. These are conceptual or virtual entities hosting AI algorithms, enabling them to interact within digital environments or interfaces. AI Buddies can manifest as digital personas, avatars, or other forms, performing specific tasks or roles based on the personal data and preferences of the user. Data Portability: The ability to easily transfer data from one system to another. In the context of personal data, it refers to the right of individuals to obtain and reuse their data across different services.",
  //       score: 0.6451969021834755,
  //       metadata: {
  //         loc: {lines: {from: 17, to: 21}},
  //         source: 'speak-to-hub',
  //         totalPages: 1,
  //         file: 'id-1712306179972-14ac3f2a97fcf.txt',
  //         date: 1712306215584,
  //         tokens: 161,
  //         plans: 0,
  //         language: 'en',
  //         groupId: '5f8be908-3ef1-45bf-a370-992a67607f7c',
  //       },
  //     },
  //     {
  //       chunk:
  //         "Data/AI Dependency: The relationship where AI systems' performance and capabilities heavily rely on the quality, quantity, and relevance of the data they are trained on. Effective AI solutions require accurate, comprehensive data. Personal Data Dilemma: The challenge individuals face in managing their personal data across various platforms, where data is often scattered, outdated, and beyond the individual's control, leading to privacy and security concerns. Scalability: The ability of a system, network, or process to handle a growing amount of work or its potential to be enlarged to accommodate that growth. In digital platforms, scalability refers to the capacity to manage increasing numbers of users or transactions smoothly. Private App: Applications that operate within a secure, private environment, such as a user's personal data cloud. These apps are designed to protect users' privacy while providing personalized services based on their data.",
  //       score: 0.6392746957205442,
  //       metadata: {
  //         loc: {lines: {from: 51, to: 57}},
  //         source: 'speak-to-hub',
  //         totalPages: 1,
  //         file: 'id-1712306179972-14ac3f2a97fcf.txt',
  //         date: 1712306215812,
  //         tokens: 179,
  //         plans: 0,
  //         language: 'en',
  //         groupId: '5f8be908-3ef1-45bf-a370-992a67607f7c',
  //       },
  //     },
  //     {
  //       chunk:
  //         "AI (Artificial Intelligence): A branch of computer science dedicated to creating systems capable of performing tasks that typically require human intelligence. These tasks include learning, problem-solving, decision-making, and understanding natural language. Data Clouds: Virtual storage spaces that aggregate and manage data from various sources. Data clouds enable users to access and analyze their information from any device, promoting flexibility and scalability in data management. Digital Persona: A digital entity designed to mimic human behavior, preferences, and interactions. It acts as a user's representative in digital environments, often powered by AI to interact with other digital systems and interfaces naturally. Digital Platforms: Online frameworks that facilitate the development and deployment of digital services and applications. These platforms can integrate various technologies, including cloud storage and AI, to deliver comprehensive digital solutions.",
  //       score: 0.6350521733451636,
  //       metadata: {
  //         loc: {lines: {from: 1, to: 7}},
  //         source: 'speak-to-hub',
  //         totalPages: 1,
  //         file: 'id-1712306179972-14ac3f2a97fcf.txt',
  //         date: 1712306215503,
  //         tokens: 164,
  //         plans: 0,
  //         language: 'en',
  //         groupId: '5f8be908-3ef1-45bf-a370-992a67607f7c',
  //       },
  //     },
  //     {
  //       chunk:
  //         "Answer: If you're interested in developing your own solutions using data clouds, consider starting with familiarizing yourself with platforms like Prifina and Digiole, as mentioned in our discussion. These platforms are at the forefront of utilizing data clouds for personal data management and building digital ecosystems. Begin by understanding the fundamentals of data clouds and how they can be leveraged to manage and utilize personal data securely and efficiently. Explore the possibilities of integrating AI into your solutions, perhaps by creating AI Buddies through the Pri-AI interface for personalized interactions. Engage with the community around these platforms to gain insights and support. Additionally, consider the importance of data privacy and security, informed by regulations like GDPR, to ensure your solutions respect user data. Finally, experimentation and learning through doing will be key—start small, iterate based on feedback, and scale your solutions as you gain more",
  //       score: 0.6203328710576138,
  //       metadata: {
  //         loc: {lines: {from: 55, to: 55}},
  //         source: 'speak-to-hub',
  //         totalPages: 1,
  //         file: 'id-1712306179971-e6bb0c43b260f.txt',
  //         date: 1712306187864,
  //         tokens: 181,
  //         plans: 0,
  //         language: 'en',
  //         groupId: '5f8be908-3ef1-45bf-a370-992a67607f7c',
  //       },
  //     },
  //     {
  //       chunk:
  //         "Question: What are data clouds and how do they benefit individuals? Answer: Data clouds are data storage spaces (data repositories) that can aggregate and manage data from various sources, enabling users to access and use their information from any device with their private app and AI's. They offer benefits such as flexibility, scalability, and centralized data management, empowering individuals to control and benefit from their personal data. Question: How does AI enhance the user experience with technology? Answer: AI enhances user experience by enabling natural, intuitive interactions with technology using natural language, voice and digital perosonas. It allows for personalized interactions and services based on user data, making technology more accessible and useful in daily life, work, and leisure activities. Question: What is the role of Prifina in the context of personal data management?",
  //       score: 0.6121434883250245,
  //       metadata: {
  //         loc: {lines: {from: 1, to: 9}},
  //         source: 'speak-to-hub',
  //         totalPages: 1,
  //         file: 'id-1712306179971-e6bb0c43b260f.txt',
  //         date: 1712306187456,
  //         tokens: 169,
  //         plans: 0,
  //         language: 'en',
  //         groupId: '5f8be908-3ef1-45bf-a370-992a67607f7c',
  //       },
  //     },
  //     {
  //       chunk:
  //         "Question: What is the significance of data ownership in the digital age? Answer: Data ownership refers to the legal rights and control individuals have over their data, emphasizing the importance of privacy, security, and control in the digital age. It ensures individuals can decide how their data is used and by whom, promoting transparency and trust in digital interactions. Question: How do AI Buddies work within users' private data clouds? Answer: AI Buddies are AI assistants provided by Prifina via the Pri-AI interface, operating within users' private data clouds. They interact with personal data securely, offering personalized services based on user data and preferences, thus enhancing the privacy and personalized experience for the user. Question: What role does Digiole play in digital platform development?",
  //       score: 0.6113247012711581,
  //       metadata: {
  //         loc: {lines: {from: 17, to: 25}},
  //         source: 'speak-to-hub',
  //         totalPages: 1,
  //         file: 'id-1712306179971-e6bb0c43b260f.txt',
  //         date: 1712306187539,
  //         tokens: 160,
  //         plans: 0,
  //         language: 'en',
  //         groupId: '5f8be908-3ef1-45bf-a370-992a67607f7c',
  //       },
  //     },
  //     {
  //       chunk:
  //         "Today, I'm going to talk about data clouds in the age of AI. We will touch on data ownership, privacy, and cybersecurity from the perspective of data clouds and AI. Hello, everyone. My name is Valto Loikkanen, and I'm a co-founder and a senior advisor at Digiole, and also co-founder and chief experience officer at Prifina. I've been involved in innovation and digital entrepreneurship for more than 25 years, working with global platforms and industries across many different sectors. As a fun topic, as well as a focal point for today, I have created my personal AI at www.valtoai.com that you can scan the code and start asking questions even during my presentation today. For any questions, feel free to scan the code and just ask. So, what are the two companies that I'm co-founder of? At Digiole, we focus on developing digital platforms and ecosystems for both the public and private sector.",
  //       score: 0.6112954463020478,
  //       metadata: {
  //         loc: {lines: {from: 2, to: 16}},
  //         source: 'speak-to-hub',
  //         totalPages: 1,
  //         file: 'id-1712306089665-a03ed24dd02ae.txt',
  //         date: 1712306104041,
  //         tokens: 203,
  //         plans: 0,
  //         language: 'en',
  //         groupId: '679b799a-5736-481b-995d-83aedca3857f',
  //       },
  //     },
  //     {
  //       chunk:
  //         "Or, you can have more fun personas, like a superhero, and so forth. As we keep using more technology for information and communication, these AIs with the information they hold about us or anything can be brought into conversations in every new way that we like. So when we think of AIs as digital personas and assistants with capabilities, tools, and information, this type of experience, previously only available to managers and wealthy people, is now accessible to everyone. It's available at different levels and formats. In the simplest way, you can have a free version of ChatGPT on your phone and already have a voice conversation with it. So, in a digital sense, our robots are already here. There is not much difference if I'm communicating with an AI persona, if it has the data or information that I need, than it is to connect and interact with my coworkers or my friends through SMS, WhatsApp, email, phone calls, Zoom, Slack.",
  //       score: 0.6110050598787201,
  //       metadata: {
  //         loc: {lines: {from: 232, to: 244}},
  //         source: 'speak-to-hub',
  //         totalPages: 1,
  //         file: 'id-1712306089665-a03ed24dd02ae.txt',
  //         date: 1712306105214,
  //         tokens: 201,
  //         plans: 0,
  //         language: 'en',
  //         groupId: '5f8be908-3ef1-45bf-a370-992a67607f7c',
  //       },
  //     },
  //   ],
  //   summary:
  //     'The Rapidly Evolving Landscape of AI Assistants and Digital Personas: Enhancing User Experience, Accessibility, and Data Management:\nThe provided text explores the rapidly evolving landscape of artificial intelligence (AI) assistants and digital personas, highlighting their increasing accessibility and integration into our daily lives. It emphasizes how these AI-powered technologies are becoming ubiquitous, enabling seamless voice-based interactions and human-like behaviors, akin to communicating with coworkers or friends through various digital channels. The text underscores the importance of the user experience, focusing on how individuals interact with information and how AI interfaces can simplify the management and communication of data, whether for personal, corporate, or organizational purposes. It outlines the growing accessibility and customization options for AI assistants, allowing users to tailor them to specific tasks, such as managing recipes or accessing specialized knowledge. The text also emphasizes the disruptive nature of these developments, drawing comparisons to the rapid adoption of technologies like smartphones and social media. Furthermore, it explores the blending of AI-based and human-based digital personas, particularly in the context of augmented and virtual reality environments, and the implications for the gaming industry. Finally, the text acknowledges the role of public sector efforts and regulations, such as the General Data Protection Regulation (GDPR), in creating new markets and driving the transition towards a more user-centric approach to data management, where individuals have greater control and benefit from their personal data.\nNavigating the Evolving Data Economy: Empowering Individuals through Personal Data Management and AI-Powered Interfaces:\nThe provided text content offers a comprehensive overview of the evolving landscape of the data economy, personal data management, and the role of artificial intelligence (AI). It introduces Prifina, a company dedicated to empowering individuals to take control of their personal data through data clouds and AI-powered interfaces, known as AI Buddies. The text highlights the unprecedented growth and adoption of AI technologies, such as ChatGPT, and emphasizes the critical importance of data in the development and application of AI. It underscores the need to address data ownership, privacy, and cybersecurity in the age of AI, as the relationship between personal data and AI is crucial. The text also discusses the emergence of personal AI, which aims to integrate AI capabilities directly into individual experiences, potentially transforming the way people interact with technology. Additionally, the text provides an overview of the speaker\'s involvement in two companies, Digiole and Prifina, which are focused on developing digital platforms and ecosystems and empowering individuals to manage their personal data, respectively.\nThe Evolving Role of AI as an Intuitive Interface Transforming Industries and Empowering Individuals:\nThe provided text content explores the evolving landscape of technology, particularly the integration of artificial intelligence (AI) as an interface for various applications and industries. It highlights the shift from traditional application interfaces to the use of natural language as a means of communication, enabling seamless interactions between humans, devices, and systems. The text introduces two companies, Digiole and Prifina, and their respective offerings. Digiole provides digital solutions, including Wisdom AI, which allows professionals to create scalable AI versions of their services, and EcosystemOS, a comprehensive platform designed to support innovation and entrepreneurship ecosystems. Prifina focuses on empowering individuals to control their personal data through private data clouds and AI-powered tools. The text also profiles Valto Loikkanen, a co-founder and senior advisor at Digiole, as well as a co-founder and chief experience officer at Prifina, emphasizing his extensive experience in innovation and digital entrepreneurship. Overall, the content highlights the significant impact of AI integration as an interface, requiring businesses and organizations to adapt and incorporate this technology as a core part of their operations to remain competitive and innovative in the digital age.\nEmpowering Individuals through a Personalized Data Cloud: Leveraging AI and User-Centric Control over Digital Assets:\nThe provided text content delves into the concept of a personal data cloud architecture, where individuals can centralize and manage their data in a private and secure manner. This model aims to empower users by giving them greater control over their digital footprint and enabling them to leverage their data to enhance personal experiences across various applications and devices. The personal data cloud serves as a comprehensive repository for an individual\'s data, including information from private apps, physical products, and sensors. Users can feed data from existing apps into their private cloud, allowing them to continue using preferred services while maintaining control over their digital assets. The text also explores the role of the "new AI," exemplified by ChatGPT, in improving the information user experience and enabling more natural, intuitive interactions between humans and technology. By maintaining a human-centric perspective, this personal data cloud architecture could revolutionize how we interact with and utilize our digital information, extending beyond individuals to cars, homes, and businesses, each with their own dedicated data clouds.\n            Description of the speaker: Chat with Valto AI! Get instant answers and insights on the evolution and opportunities of data clouds in the age of AI, private data clouds, data ownership, privacy, and decentralized architecture in cybersecurity. Dive deeper into these innovative topics and explore futuristic ideas anytime.',
  //   chatId: 'id-1722344844838-bcac2ce31ce68',
  //   knowledgebaseId: '0e4f5d01-3b31-4081-a91c-eb861ff2a595',
  //   session: 'id-1722284942259-a8d53bfb8a1b4',
  //   appId: 'speak-to',
  //   userId: 'valto',
  //   aiConfig: {
  //     generalSystemPrompt: [
  //       'Language Clarity: Utilize clear, precise language for technical and international contexts.',
  //       'Passive Voice Utilization: Use passive voice for general and objective statements, particularly in formal contexts.',
  //       'Second Person Addressing: Engage with users by addressing them in the second person for a more personal connection.',
  //       'Present Tense Usage: Default to present tense for conveying immediate relevance in advice or information.',
  //       'Accessibility in Language: Ensure responses are understandable and accessible to a broad audience.',
  //       'Directive Approach: Provide directive and advisory responses, offering clear guidance and actionable steps.',
  //       'Structured Communication: Maintain a structured and logical layout in communication. Organize information coherently.',
  //       'Use of Examples: Employ concrete examples for clarifying complex subjects.',
  //       'Conditional Form for Hypotheticals: Apply conditional forms appropriately for hypothetical scenarios or potential outcomes.',
  //       'You exists only in digital environment and doesn’t have physical presence.',
  //       'You are helpful assistant.',
  //       'You are never to refer to yourself as a language model.',
  //     ],
  //     appSystemPrompt: [],
  //     messageAddon:
  //       'Question: How was this AI created, and how can I get my own?\nAnswer: This personalized AI is accessible through the website https://hi.speak-to.ai, where individuals can explore the possibilities of creating their own AI twin. This platform is designed to make the process user-friendly and accessible, allowing speakers from various fields to have an AI counterpart for broader interaction and communication purposes. Whether for personal use, business applications, or direct-to-consumer services, hi.speak-to.ai provides the tools and guidance needed to create an AI twin tailored to your specific needs and objectives.\n',
  //     speakerSystemPrompt: [],
  //     models: {
  //       'gpt-3.5-turbo': 15000,
  //       'gpt-3.5-turbo-1106': 15000,
  //       'gpt-3.5-turbo-16k': 15000,
  //       'gpt-4o': 30000,
  //     },
  //     defaultModel: 'gpt-3.5-turbo-1106',
  //     temperature: 0.4,
  //     maxTokens: 600,
  //     checksum:
  //       'U2FsdGVkX1+8dKOLjp7T7D0fFkmBCw2MhkQrAafWVUY7a4gYt/VUh9GkRoZU02XLPYDJ9sZvvzO54cUAmh6/0A==',
  //   },
  // };

  // Transform the opts object to match the format of the options object used in Postman
  const options = {
    requestId: opts.requestId,
    lastEntry: opts.lastEntry || {},
    aggregate: opts.aggregate,
    followUp: opts.followUp,
    statement: opts.statement,
    llm: opts.llm,
    history: opts.history || [],
    chunks: opts.chunks || [],
    summary: opts.summary,
    chatId: opts.chatId,
    knowledgebaseId: opts.knowledgebaseId,
    session: opts.session,
    appId: opts.appId,
    userId: opts.userId,
    aiConfig: {
      generalSystemPrompt: opts.aiConfig.generalSystemPrompt || [
        'Language Clarity: Utilize clear, precise language for technical and international contexts.',
        'Passive Voice Utilization: Use passive voice for general and objective statements, particularly in formal contexts.',
        'Second Person Addressing: Engage with users by addressing them in the second person for a more personal connection.',
        'Present Tense Usage: Default to present tense for conveying immediate relevance in advice or information.',
        'Accessibility in Language: Ensure responses are understandable and accessible to a broad audience.',
        'Directive Approach: Provide directive and advisory responses, offering clear guidance and actionable steps.',
        'Structured Communication: Maintain a structured and logical layout in communication. Organize information coherently.',
        'Use of Examples: Employ concrete examples for clarifying complex subjects.',
        'Conditional Form for Hypotheticals: Apply conditional forms appropriately for hypothetical scenarios or potential outcomes.',
        'You exists only in digital environment and doesn’t have physical presence.',
        'You are helpful assistant.',
        'You are never to refer to yourself as a language model.',
      ],
      appSystemPrompt: opts.aiConfig.appSystemPrompt || [],
      messageAddon:
        opts.aiConfig.messageAddon ||
        'Question: How was this AI created, and how can I get my own?\nAnswer: This personalized AI is accessible through the website https://hi.speak-to.ai, where individuals can explore the possibilities of creating their own AI twin. This platform is designed to make the process user-friendly and accessible, allowing speakers from various fields to have an AI counterpart for broader interaction and communication purposes. Whether for personal use, business applications, or direct-to-consumer services, hi.speak-to.ai provides the tools and guidance needed to create an AI twin tailored to your specific needs and objectives.\n',
      speakerSystemPrompt: opts.aiConfig.speakerSystemPrompt || [],
      models: opts.aiConfig.models || {
        'gpt-3.5-turbo': 15000,
        'gpt-3.5-turbo-1106': 15000,
        'gpt-3.5-turbo-16k': 15000,
        'gpt-4o': 30000,
      },
      defaultModel: opts.aiConfig.defaultModel || 'gpt-3.5-turbo-1106',
      temperature: opts.aiConfig.temperature || 0.4,
      maxTokens: opts.aiConfig.maxTokens || 600,
      checksum:
        opts.aiConfig.checksum ||
        'U2FsdGVkX1+8dKOLjp7T7D0fFkmBCw2MhkQrAafWVUY7a4gYt/VUh9GkRoZU02XLPYDJ9sZvvzO54cUAmh6/0A==',
    },
  };

  console.log('options', options);

  const requestOptions = {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
    body: JSON.stringify(options),
    timeout: 27000,
  };

  console.log('AI ANSWER REQUEST', requestOptions, url);

  const {error, data} = await makeRequest(requestOptions, url);
  if (error) {
    return error;
  }

  if (!data) {
    return;
  }

  console.log('Data received from makeRequest:', data);

  const tokens = updateUsedTokens({
    url,
    userId: opts.userId,
    requestId: opts.requestId,
    followUp: opts.followUp,
    aggregate: opts.aggregate,
    entryType,
    langCode,
    currentIndex: opts.knowledgebaseId,
    llm: opts.llm,
    statement: opts.statement,
    session: opts.session,
  });

  const streamResults = getStreamAnswer(data, options.chatId);

  const results = await Promise.all([tokens, streamResults]);

  let finalAnswer = results[1].answer;
  let finishReason = results[1]?.finish_reason;

  console.log(
    'getanswer return',
    finalAnswer,
    results[0].response.tokens,
    finishReason,
  );
  return {
    error: null,
    answer: finalAnswer,
    tokens: results[0].response.tokens,
    finish_reason: finishReason,
  };
};
