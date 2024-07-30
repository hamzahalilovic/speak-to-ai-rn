import {create} from 'zustand';

import {v4 as uuidv4} from 'uuid';

import {EVALS} from '../appConfig';

import {generateUniqueId} from '../utils';

import {Dimensions} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

async function checkStorage() {
  let session = generateUniqueId();
  try {
    const speakToStorage = await AsyncStorage.getItem(EVALS.appStorage);
    let speakTo = {};
    if (speakToStorage !== null) {
      speakTo = JSON.parse(speakToStorage);
    }

    if (speakTo?.session === undefined) {
      speakTo['session'] = session;
      await AsyncStorage.setItem(EVALS.appStorage, JSON.stringify(speakTo));
    } else {
      session = speakTo.session;
    }
  } catch (error) {
    console.error('Error accessing storage:', error);
  }

  console.log('session IDDDD', session);
  return session;
}

async function aiConfigStorage(config) {
  try {
    const speakToStorage = await AsyncStorage.getItem(EVALS.appStorage);
    console.log('speakTOStorage', speakToStorage);
    let speakTo = {};
    if (speakToStorage !== null) {
      speakTo = JSON.parse(speakToStorage);
    }

    speakTo['aiConfig'] = {...speakTo['aiConfig'], ...config};
    await AsyncStorage.setItem(EVALS.appStorage, JSON.stringify(speakTo));
  } catch (error) {
    console.error('Error accessing storage:', error);
  }
}

function getUrl() {
  let url = 'http://localhost:3332/api/v1';
  // if (typeof window !== 'undefined') {
  //   url = window.location.origin + '/api/v1';
  // }
  return url;
}

function checkLng() {
  let userlang = 'en';
  // if (typeof window !== 'undefined') {
  //   userlang = navigator.language || navigator.userLanguage;
  // if (userlang.startsWith('en-')) {
  //   userlang = userlang.toLowerCase().substring(0, 2);
  // }
  // }
  return userlang;
}

// const sessionID = await checkStorage();
// console.log('speakto', sessionID);
console.log('get url', getUrl());
const useStore = create((set, get) => ({
  url: getUrl(),
  currentUser: '',
  requestId: '',
  disclaimerStatus: false,
  getDisclaimerStatus: () => {
    return get().disclaimerStatus;
  },
  setDisclaimerStatus: () => {
    return get().disclaimerStatus;
  },
  sessionID: '',
  language: checkLng(),
  scoreLimit: EVALS.defaultScoreLimit,
  example: {question: '', show: false},
  isFooterRendered: false,
  queryActive: false,
  haveChunks: false,
  summary: '',
  lastGoodAnswer: {},
  currentTopic: 'topic-0',
  models: {'gpt-3.5-turbo': 15000, 'gpt-3.5-turbo-1106': 15000},
  defaultModel: 'gpt-3.5-turbo-1106',

  setCurrentTopic: value => set(() => ({currentTopic: value})),
  setSummary: value => set(() => ({summary: value})),
  setLastGoodAnswer: value => set(() => ({lastGoodAnswer: value})),
  setHaveChunks: value => set(() => ({haveChunks: value})),
  setQueryActive: value => set(() => ({queryActive: value})),
  setIsFooterRendered: value => set(() => ({isFooterRendered: value})),
  setExample: value => set(() => ({example: value})),
  setSessionID: value => set(() => ({sessionID: value})),

  setCurrentUser: value => set(() => ({currentUser: value})),
  setRequestId: value => set(() => ({requestId: value || uuidv4()})),
  setAIConfig: value => {
    aiConfigStorage(value);
  },
  getAIConfig: async () => {
    try {
      const speakToStorage = await AsyncStorage.getItem(EVALS.appStorage);
      if (speakToStorage !== null) {
        const speakTo = JSON.parse(speakToStorage);
        return speakTo.aiConfig;
      }
    } catch (error) {
      console.error('Error accessing storage:', error);
    }
    return {};
  },
  initializeSession: async () => {
    const sessionID = await checkStorage();
    set({sessionID});
  },
}));

export default useStore;
