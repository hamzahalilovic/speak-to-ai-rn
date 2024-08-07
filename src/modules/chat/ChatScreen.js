import {useCallback, useEffect, useReducer, useRef, useState} from 'react';

import Icon from 'react-native-vector-icons/Ionicons';
// import axios from 'axios';

import Footer from '../../Footer';

import Header from '../../Header2';
// import Welcome from '../../Welcome';
import {
  // View,
  // ScrollView,
  TextInput,
  Dimensions,
  useWindowDimensions,
  Platform,
} from 'react-native';

import {findNodeHandle} from 'react-native';
import {UIManager} from 'react-native';
import {EVALS, theme, links} from '../../appConfig';
import {fetchWithTimeout, generateUniqueId} from '../../utils';
import autosize from 'autosize';

import {clientInit} from '../../utils/getInit';

import AnswerCard from './components/AnswerCard';
import QuestionCard from './components/QuestionCard';
import ChatlogContainer from './components/ChatlogContainer';

// import {QuestionCard} from '../../components/index';

import {useVectorStore} from '../../store/zustand';

import {useShallow} from 'zustand/react/shallow';

import {
  aiAnswer,
  getHistory,
  scoreInfo,
  updateUsedTokens,
} from '../../utils/getAnswer';
import {getData} from '../../utils/getChunks';

import useStore from '../../store/helper';
import {__} from '../../utils/lng';

import WelcomeContainer from '../../Welcome';
import {initTextData} from '../../utils/initTextData';
import {
  View,
  ScrollView,
  Box,
  Button,
  Center,
  Flex,
  VStack,
  useToast,
  extendTheme,
  Text,
  Spinner,
  Alert,
  Card,
  Avatar,
  HStack,
  KeyboardAvoidingView,
} from 'native-base';

import {
  NEXT_PUBLIC_APP_ID,
  NEXT_PUBLIC_APP_DEV,
  APP_ID,
  MIDDLEWARE_API_URL,
} from '@env';
import {useNavigation, useRoute} from '@react-navigation/native';
import ChatInput from './components/ChatInput';
import {useAppContext} from '../../context/AppContext';
import CustomHeader from './components/CustomHeader';
import {getThreads, saveThread, saveThreads} from './utils/threadsStorage';

// remove this when has better way to do this
function ConditionalToast({shouldShowToast, speaker}) {
  const toast = useToast();
  //const navigate = useNavigate();
  const effectCalled = useRef(false);
  useEffect(() => {
    // console.log("HERE ", speaker, effectCalled.current);
    // locally, the first round the page is not yet ready...
    if (!effectCalled.current) {
      effectCalled.current = true;
      if (shouldShowToast) {
        toast({
          title: `Unknown Speaker [${speaker}]`,
          description:
            'Page will be automatically redirected to the Speak to page.',
          status: 'error',
          duration: 10000,
          isClosable: true,
          onCloseComplete: () => {
            // window.location.href = links.speakTo;
          },
        });
        //console.log("TOAST HERE...")
      }
    }
  }, [shouldShowToast, speaker, toast]);

  return null;
}

const ChatScreen = () => {
  const [props, setProps] = useState({});

  const [tempInputValue, setTempInputValue] = useState('');

  const [inputValue, setInputValue] = useState('');
  // const API_URL = 'http://localhost:3001/api/v1';

  const navigation = useNavigation();
  const route = useRoute();
  // const {username} = props.name || {};
  //get username from navigation
  // const username = 'markus';
  const [username, setUsername] = useState('');

  const [haveAnswer, setHaveAnswer] = useState(false);
  const [sidebarShown, setSidebarShown] = useState(false);
  const {isOpen, onOpen, onClose} = useState();

  const [error, setError] = useState('w');

  const {width, height} = useWindowDimensions();

  const scrollSpan = useRef();
  const scrollSpan2 = useRef();
  const sideBar = useRef();
  const statement = useRef();
  const [status, setStatus] = useState('ready');

  const toast = useToast();
  const disclaimerToastID = 'disclaimer-toast-init';

  // console.log('props', props);
  const [knowledgebase, setKnowledgebase] = useState({}); // Use state instead of ref

  // const knowledgebase = useRef(props);

  // useEffect(() => {
  //   if (props && props.name) {
  //     knowledgebase.current = props;
  //   }
  // }, [props]);

  // knowledgebase.current = props;

  const uniqueId = useRef();
  const haveChunks = useRef(false);
  const [messageList, setMessageList] = useState([]);

  const exampleQuestionClicked = useRef(false);

  const [shiftTop, setShiftTop] = useState(false);
  const scrollViewRef = useRef(null);

  const [state, setState] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      errors: false,
      loading: true,
      isUpdated: true,
    },
  );

  const messagesRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const [textData, setTextData] = useState({});
  const {
    currentUser,
    setCurrentUser,
    requestId,
    setRequestId,
    url,
    sessionID,
    language,
    scoreLimit,
    example,
    setExample,
    isFooterRendered,
    setIsFooterRendered,
    queryActive,
    setQueryActive,
    summary,
    setSummary,
    lastGoodAnswer,
    setLastGoodAnswer,
    models,
    defaultModel,
    currentTopic,
    setCurrentTopic,
    getDisclaimerStatus,
    setDisclaimerStatus,
    getAIConfig,
    setAIConfig,
    initializeSession,
  } = useStore(
    useShallow(state => ({
      currentUser: state.currentUser,
      requestId: state.requestId,
      url: state.url,
      language: state.language,
      example: state.example,
      scoreLimit: state.scoreLimit,
      sessionID: state.sessionID,
      isFooterRendered: state.isFooterRendered,
      queryActive: state.queryActive,
      // haveChunks: state.haveChunks,
      summary: state.summary,
      lastGoodAnswer: state.lastGoodAnswer,
      models: state.models,
      defaultModel: state.defaultModel,
      currentTopic: state.currentTopic,
      setCurrentTopic: state.setCurrentTopic,
      setLastGoodAnswer: state.setLastGoodAnswer,
      setSummary: state.setSummary,
      //setHaveChunks: state.setHaveChunks,
      setQueryActive: state.setQueryActive,
      setIsFooterRendered: state.setIsFooterRendered,
      setRequestId: state.setRequestId,
      setCurrentUser: state.setCurrentUser,
      setExample: state.setExample,
      setDisclaimerStatus: state.setDisclaimerStatus,
      getDisclaimerStatus: state.getDisclaimerStatus,
      getAIConfig: state.getAIConfig,
      setAIConfig: state.setAIConfig,
      initializeSession: state.initializeSession,
    })),
  );

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  console.log('session', sessionID);

  const showDisclaimerToast = useCallback(() => {
    // if (!toast.isActive(disclaimerToastID)) {
    //   toast.show({
    //     id: disclaimerToastID,
    //     title: 'Disclaimer',
    //     description:
    //       'This is my personal AI twin. It interprets information I have provided. Please note that any intentional misuse is recorded.',
    //     duration: null,
    //     isClosable: true,
    //   });
    // } else {
    //   return null;
    // }
  }, [toast]);

  const functionContent = useRef();

  const topicList = useRef([currentTopic]);
  const messages = useRef([]);

  const effectCalled = useRef(false);

  const {getLastItem, getItems, insert, semanticSearch} = useVectorStore(
    useShallow(state => ({
      getLastItem: state.getLastItem,
      getItems: state.getItems,
      insert: state.insert,
      semanticSearch: state.semanticSearch,
    })),
  );

  useEffect(() => {
    //console.log("LOADING...", state.loading);
    if (!state.loading && !getDisclaimerStatus()) {
      setTimeout(() => {
        showDisclaimerToast();
        setDisclaimerStatus(true);
      }, 300);
    }
  }, [
    state.loading,
    showDisclaimerToast,
    getDisclaimerStatus,
    setDisclaimerStatus,
  ]);

  console.log('statement1', statement);

  // useEffect(() => {
  //   if (haveAnswer) {
  //     // statement.current.blur(); // blur the TextInput to indicate it's disabled
  //     setStatus('ready');
  //     scrollViewRef.current.scrollToEnd({animated: true});
  //     statement.current.focus();
  //     // inputValue.focus();
  //   }
  // }, [haveAnswer]);

  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        // scrollViewRef.current.scrollToEnd({animated: true});
      }, 100); // A small delay ensures the layout updates before scrolling
    }
  }, [messageList]);

  const handleFeedbackClick = useCallback(
    async e => {
      console.log('Feedback Clicked! ', e, sessionID);
    },
    [sessionID],
  );

  const {selectedAI, currentThreadId, setCurrentThreadId, threads, setThreads} =
    useAppContext(); // Access selected AI from context

  const [propsFetched, setPropsFetched] = useState(false); // State to track props fetching
  useEffect(() => {
    const API_URL = `http://localhost:3001/api/v1/navigate${
      selectedAI?.id || ''
    }`;
    console.log('API URL', API_URL);

    const fetchProps = async () => {
      setState({loading: true});

      try {
        const response = await fetch(`${API_URL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        setProps(result);
        // knowledgebase.current = result;
        setKnowledgebase(result);
        setPropsFetched(true); // Set to true after fetching is done
      } catch (err) {
        setError(err.message);
        setPropsFetched(false); // Ensure it's false on error
      } finally {
        setState({loading: false});
      }
    };

    // Trigger fetchProps whenever selectedAI changes

    fetchProps();
  }, [selectedAI]); // Depend on selectedAI
  useEffect(() => {
    console.log('selectedAI', selectedAI);

    setUsername(selectedAI.id);

    // const API_URL = `http://localhost:3001/api/v1/navigate${
    //   selectedAI?.id || ''
    // }`;

    // const fetchProps = async () => {
    //   try {
    //     const response = await fetch(`${API_URL}`, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //     });

    //     if (!response.ok) {
    //       throw new Error('Network response was not ok');
    //     }

    //     const result = await response.json();
    //     setProps(result);
    //     knowledgebase.current = result;
    //   } catch (err) {
    //     setError(err.message);
    //   } finally {
    //     setState({loading: false});
    //   }
    // };

    async function init() {
      effectCalled.current = true;
      setState({loading: true});

      console.log('INIT ', username, knowledgebase);

      if (username) {
        setCurrentUser(knowledgebase.name);
        const {error, data} = await clientInit(fetchWithTimeout, {
          sessionID,
          knowledgebaseId: knowledgebase.knowledgebaseId,
          sourceLng: EVALS.contentLng,
          targetLng: language,
          includeExample: true,
        });

        if (error) {
          toast.show({title: error.message || error.name, status: 'error'});
          return;
        }

        const aiConfig = {
          generalSystemPrompt: data.response.generalSystemPrompt,
          appSystemPrompt: data.response.appConfig['system-prompt'],
          messageAddon: data.response.appConfig.messageAddon,
          speakerSystemPrompt: [],
          models: data.response.models,
          defaultModel,
          temperature: data.response.temperature,
          maxTokens: data.response.maxTokens,
        };

        const checksumResponse = await fetchWithTimeout(`${url}/getCheckSum`, {
          method: 'POST',
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(aiConfig),
        });

        console.log('checksum response', checksumResponse);

        if (!checksumResponse.ok) {
          const error = await requestResponse.text();
          console.error('ERROR ', error);
          setState({errors: true});
          return;
        }
        const checksum = await checksumResponse.json();
        console.log('checksum', checksum);

        setAIConfig({...aiConfig, checksum: checksum.response});

        if (true) {
          setExample({question: data.response.question, show: true});
        }

        let summary = data.response.summary;

        if (knowledgebase.description && knowledgebase.description.length > 0) {
          summary = `${summary}
            Description of the speaker: ${knowledgebase.description}`;
        }

        setSummary(summary);
        setState({loading: false});
        setTextData(await initTextData());
      }
    }

    if (propsFetched) {
      // Re-run init only after props have been fetched
      init();
    }
  }, [
    propsFetched,
    username,
    toast,
    sessionID,
    url,
    setCurrentUser,
    language,
    setExample,
    setSummary,
    showDisclaimerToast,
    setAIConfig,
    defaultModel,
    knowledgebase,
  ]);
  console.log('unique id uniqueId.current 1', uniqueId.current);

  useEffect(() => {
    console.log('useEffect called');

    /*  const getFunctionAnswer = async () => {
 
       const chatId = uniqueId.current;
 
       scrollSpan.current.scrollIntoView(true, { behavior: "auto", block: "end", inline: "nearest" });
 
       setHaveAnswer(true);
       queryActive.current = false;
 
     } */

    const getAnswer = async (
      chunks,
      scores,
      followUp,
      aggregate,
      newInput,
      entryType,
      langCode,
      tokens,
      contentInput = '',
    ) => {
      // let entry = statement.current.value.trim();

      let entry = inputValue;
      console.log('entry', entry);
      if (entry === '') {
        return;
      }
      if (entryType === 1 && !entry.endsWith('?')) {
        entry += '?';
      }
      if (entryType === -1 && !entry.endsWith('.') && !entry.endsWith('!')) {
        entry += '.';
      }

      console.log('unique id uniqueId.current 2', uniqueId.current);

      const chatId = uniqueId.current;
      let followUpUpdate = followUp;
      // history content....
      //const lastEntry = getLastItem();
      //const lastEntry = lastGoodAnswer.current;
      const lastEntry = lastGoodAnswer;
      const queryResult = await semanticSearch({
        text: entry,
        score: 0.3,
        topK: 5,
      });
      console.log('QUERY RESULT ', queryResult);
      let historyContent = [];
      if (queryResult.length > 0) {
        const sessionItems = getItems();

        //currentTopic.current = queryResult[0].item.metadata.topic;
        setCurrentTopic(queryResult[0].item.metadata.topic);
        const maxTokens = models[defaultModel];
        if (tokens < maxTokens - 2000) {
          historyContent = getHistory(
            tokens,
            maxTokens - 1000,
            queryResult,
            sessionItems,
            currentTopic,
          );
        }
      } else {
        const topic = `topic-${topicList.current.length}`;
        topicList.current.push(topic);
        //currentTopic.current = topic;
        setCurrentTopic(topic);
        if (!lastGoodAnswer.followUp) {
          followUpUpdate = false;
        }
      }

      console.log('chunks', chunks);
      console.log('chatId', chatId);
      console.log(
        'results',
        url,
        requestId,
        lastEntry,
        aggregate,
        followUpUpdate,
        entry,
        defaultModel,
        historyContent,
        chunks,
        summary,
        chatId,
        knowledgebase.knowledgebaseId,
        sessionID,
        entryType,
        langCode,
        APP_ID,
        currentUser,
        getAIConfig(),
        exampleQuestionClicked.current,
      );

      const results = await aiAnswer({
        url,
        requestId,
        lastEntry,
        aggregate,
        followUp: followUpUpdate,
        statement: entry,
        llm: defaultModel,
        history: historyContent,
        chunks,
        summary,
        chatId,
        knowledgebaseId: knowledgebase.knowledgebaseId,
        session: sessionID,
        entryType,
        langCode,
        appId: APP_ID,
        userId: currentUser,
        aiConfig: getAIConfig(),
        exampleClick: exampleQuestionClicked.current,
      });

      // reset example click status...
      exampleQuestionClicked.current = false;
      if (results.error) {
        toast({
          title: results.error.message || results.error.name,
          status: 'error',
          description: results.error.cause.info,
        });
        const msgIndex = messageList.length - 1;
        const updatedMessageList = [...messageList];
        updatedMessageList[msgIndex][1].streaming = false;
        setHaveAnswer(true);

        setQueryActive(false);
        statement.current.value = '';
        setInputValue('');
        return;
      }

      console.log('GET ANSWER END RESULTS  ', results);
      const msgIndex = messageList.length - 1;

      const updatedMessageList = [...messageList];
      updatedMessageList[msgIndex][1].answer = results.answer;
      updatedMessageList[msgIndex][1].streaming = false;

      console.log('updatedMessageList', updatedMessageList);

      // answer has html tags like this <br/>
      const cleanedAnswer = results.answer
        .replace(/<br\/>/g, '\n')
        .replace(/<\/?[^>]+(>|$)/g, ' ')
        .trim();

      const avgScore =
        scores.reduce((total, score) => total + score, 0) / scores.length || 0;
      const formattedScore = avgScore > 0 ? avgScore.toFixed(2) : avgScore;

      messages.current.push({
        answer: cleanedAnswer,
        statement: entry,
        score: formattedScore,
      });

      if (avgScore >= scoreLimit + 0.1) {
        //0.3
        //lastGoodAnswer.current = { answer: cleanedAnswer, aggregate, statement: entry, followUp: followUpUpdate, entryType }
        setLastGoodAnswer({
          answer: cleanedAnswer,
          aggregate,
          statement: entry,
          followUp: followUpUpdate,
          entryType,
        });
      } else {
        // lastGoodAnswer.current = {};
        setLastGoodAnswer({});
      }
      if (contentInput !== '') {
        updatedMessageList[msgIndex][1].details = __(
          `This answer bypasses default content, instead new @get content and history was used.`,
          language,
        );
        updatedMessageList[msgIndex][1].info = __('info-color', language);
      } else {
        const {details, info} = scoreInfo(avgScore, scoreLimit);
        updatedMessageList[msgIndex][1].details = __(details, language);
        updatedMessageList[msgIndex][1].info = __(info, language);
      }

      setMessageList(updatedMessageList);

      /////UPDATING THREADS LOCALLY AS SOON AS ANSWER IS RECEIVED
      // Save the thread immediately after the answer is received

      const updatedThreads = threads.map(thread =>
        thread.id === currentThreadId
          ? {...thread, messages: updatedMessageList}
          : thread,
      );

      setThreads(updatedThreads);
      await saveThreads(selectedAI.knowledgebaseId, updatedThreads); // Save updated threads to Async Storage

      /////////////////////////////////

      updateUsedTokens({
        url,
        userId: currentUser,
        requestId,
        finish_reason: results.finish_reason,
        currentIndex: knowledgebase.knowledgebaseId,
        llm: defaultModel,
        statement: entry,
        session: sessionID,
        answer: results.answer,
        score: avgScore,
        tokens: results.tokens,
        langCode,
      }).then(updateRes => {
        //console.log("UPDATE USED TOKENS IN VECTOR ", updateRes);
        //console.log("UPDATE USED TOKENS IN VECTOR ", updateRes.response);
        console.log('UPDATE USED TOKENS IN VECTOR ', updateRes.response.tokens);

        // add Q/A into vector
        insert({
          text: `${entry} ${cleanedAnswer}`,
          metadata: {
            entry,
            answer: cleanedAnswer,
            tokens: updateRes.response.tokens,
            topic: currentTopic,
          },
        });
      });

      // update logger final used tokens
      // const { session, question, messages: tokenMessages, llm, answer, score, tokens } = req.body;
      setHaveAnswer(true);

      //queryActive.current = false;
      setQueryActive(false);
      statement.current.value = '';
      setInputValue('');
    };
    const getChunks = async entry => {
      console.log('GET CHUNKS ', sessionID, entry);
      console.log(messageList);

      console.log('eentry', entry);
      console.log('eentry', entry);

      const {
        error: dataError,
        chunks,
        scores,
        functions,
        confidence,
        tokens,
        searchAggregation,
        followUp,
        entryType,
        langCode,
        newInput,
      } = await getData(
        entry,
        lastGoodAnswer,
        {sessionID, scoreLimit, contentLng: EVALS.contentLng},
        knowledgebase.knowledgebaseId,
        true,
      );

      if (dataError) {
        toast({
          title: dataError.message || dataError.name,
          status: 'error',
          description: dataError.cause.info,
        });
        console.log('dataerror', dataError);
        const msgIndex = messageList.length - 1;
        const updatedMessageList = [...messageList];
        updatedMessageList[msgIndex][1].streaming = false;
        setHaveAnswer(true);
        setQueryActive(false);
        //queryActive.current = false;
        statement.current.value = '';
        setInputValue('');
        return;
      }

      console.log('FINAL CHUNKS ', chunks, confidence);

      const msgIndex = messageList.length - 1;
      const updatedMessageList = [...messageList];
      if (chunks.length > 0) {
        //updatedMessageList[msgIndex][0].details = `${chunks.length} chunks were found. Average confidence is ${confidence}.`;
        updatedMessageList[msgIndex][0].details = __(
          '{{chunks}} chunks were found. Average confidence is {{confidence}}',
          language,
          {chunks: chunks.length, confidence},
        );
      } else {
        updatedMessageList[msgIndex][0].details = __(
          'Nothing was found',
          language,
        );
      }
      console.log('updatedmessageList', updatedMessageList);
      setMessageList(updatedMessageList);

      //setHaveChunks(true);
      haveChunks.current = true;
      functionContent.current = null;
      // disable functions for now...
      getAnswer(
        chunks,
        scores,
        followUp,
        searchAggregation,
        newInput,
        entryType,
        langCode,
        tokens,
      );
    };

    if (inputValue !== '') {
      console.log('uniquie ID and input value', uniqueId, inputValue);

      // Check if the unique ID element exists and if the input value is not empty
      const inputValue1 = inputValue;
      if (inputValue1 !== '') {
        setHaveAnswer(false);

        // Scroll to the end of the ScrollView
        // scrollViewRef.current.scrollToEnd({animated: true});
        console.log('have chunks', haveChunks.current);
        console.log('have inputValue1', inputValue1);
        // Call getChunks if haveChunks is false
        if (!haveChunks.current) {
          getChunks(inputValue1);
        }
      }
    }
  }, [
    inputValue,
    messageList,
    sessionID,
    semanticSearch,
    insert,
    getItems,
    getLastItem,
    toast,
    currentUser,
    requestId,
    url,
    scoreLimit,
    language,
    setQueryActive,
    summary,
    lastGoodAnswer,
    setLastGoodAnswer,
    models,
    defaultModel,
    currentTopic,
    setCurrentTopic,
    getAIConfig,
  ]);

  console.log('session', sessionID);
  console.log('threads', threads);

  const handleNewMessage = async text => {
    if (!queryActive && currentThreadId) {
      setRequestId();
      setStatus('processing');
      setInputValue(tempInputValue);
      setTempInputValue('');
      uniqueId.current = generateUniqueId();

      const userChat = {
        value: text,
        uniqueId: uniqueId.current,
        details: '',
      };
      const aiChat = {
        uniqueId: uniqueId.current,
        answer: '',
        streaming: true, // initially set to true
      };

      const updatedMessages = [
        ...messageList,
        [userChat, aiChat, uniqueId.current],
      ];
      setMessageList(updatedMessages);

      // Update the current thread with the new messages
      const updatedThreads = threads.map(thread =>
        thread.id === currentThreadId
          ? {...thread, messages: updatedMessages}
          : thread,
      );

      setThreads(updatedThreads);
      saveThreads(selectedAI.knowledgebaseId, updatedThreads); // CHECK LATER IF NEEDED

      setQueryActive(true);
      haveChunks.current = false;
    } else {
      console.error('No currentThreadId, query is active, or text is empty');
    }
  };

  const handleNewThread = async () => {
    const newThreadId = generateUniqueId();
    const newThread = {
      id: newThreadId,
      title: `Thread ${new Date().toLocaleString()}`,
      messages: [],
      createdAt: new Date().toLocaleString(),
    };

    const isDuplicate = threads.some(thread => thread.id === newThreadId);
    if (!isDuplicate) {
      const updatedThreads = [...threads, newThread];
      setThreads(updatedThreads);
      setCurrentThreadId(newThreadId);
      setMessageList([]);
      scrollViewRef.current?.scrollTo({y: 0, animated: true});
      await saveThreads(selectedAI.knowledgebaseId, updatedThreads); // Save new thread to Async Storage
    } else {
      console.warn('Duplicate thread creation attempted');
    }
  };
  useEffect(() => {
    const fetchThreads = async () => {
      const loadedThreads = await getThreads(selectedAI.knowledgebaseId);
      setThreads(loadedThreads);

      if (loadedThreads.length > 0) {
        if (currentThreadId) {
          const selectedThread = loadedThreads.find(
            thread => thread.id === currentThreadId,
          );
          setMessageList(selectedThread?.messages || []);
        } else {
          const firstThreadId = loadedThreads[0].id;
          setCurrentThreadId(firstThreadId);
          setMessageList(loadedThreads[0].messages);
        }
      } else {
        handleNewThread(); // Safely create a new thread if none exist
      }
    };

    fetchThreads();
  }, [selectedAI, currentThreadId]);

  console.log('route params', route.params);

  console.log('state', state);

  console.log('inputvalue', inputValue);

  console.log('messageList', messageList);

  console.log('currentUser', currentUser);

  console.log('threads in cha screen', threads);

  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: '#f5f5f5', width: '100%'}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={{flex: 1, backgroundColor: '#f5f5f5', width: '100%'}}>
        {/* <CustomHeader handleNewThread={handleNewThread} /> */}
        <CustomHeader
          knowledgebaseId={knowledgebase.knowledgebaseId}
          name={knowledgebase.name}
          handleNewThread={handleNewThread}
          isNewThreadDisabled={messageList.length === 0}
        />
        {state.loading ? (
          <Center flex={1}>
            <Spinner size="lg" />
          </Center>
        ) : state.errors ? (
          <Alert status="error">Invalid username</Alert>
        ) : (
          <>
            <ScrollView
              ref={scrollViewRef}
              style={{flex: 1}}
              contentContainerStyle={{paddingBottom: 80, width: '100%'}} // Ensure there's enough space for the ChatInput
            >
              <ChatlogContainer
                sidebarShown={sidebarShown}
                style={{width: '100%'}}>
                <HStack gap="0px" width="100%" height="100%">
                  <VStack
                    h="100%"
                    w="100%"
                    mt="-20px"
                    mb="-10px"
                    space={1}
                    color="black">
                    <Flex
                      ref={messagesContainerRef}
                      id="messages_container"
                      style={{flex: 1, width: '100%'}}>
                      <Box
                        id="messages"
                        ref={messagesRef}
                        style={{
                          flex: 1,

                          width: '100%',
                        }}>
                        <Box padding="24px" paddingBottom="0px">
                          {messageList.map((message, key) => (
                            <Box
                              key={`chats-${key}`}
                              className="messageContainer">
                              <QuestionCard
                                key={`question-${key}`}
                                message={message[0]}
                              />
                              <AnswerCard
                                handleFeedbackClick={handleFeedbackClick}
                                message={message[1]}
                                knowledgeBase={knowledgebase}
                                language={language}
                              />
                            </Box>
                          ))}
                          <Text
                            style={{
                              height: '10px',
                              width: '100%',
                              marginBottom: '25px',
                            }}
                            ref={scrollSpan}
                            id="scroll-marker"
                          />
                        </Box>
                      </Box>
                    </Flex>
                  </VStack>
                </HStack>
              </ChatlogContainer>
            </ScrollView>
            <Box
              style={{
                position: 'absolute',
                bottom: 20,
                left: 0,
                right: 0,
                zIndex: 9999,
              }}>
              <ChatInput
                ref={statement}
                value={tempInputValue}
                onChangeText={setTempInputValue}
                onSubmitEditing={() => handleNewMessage(tempInputValue)}
                placeholder="Ask anything..."
                editable={!queryActive}
              />
            </Box>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
