import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {getPresetAITwins} from '../modules/discover/utils/aiTwinsStorage';

const AppContext = createContext();

export const AppContextProvider = ({children}) => {
  const [selectedAI, setSelectedAI] = useState(null);
  const [threads, setThreads] = useState([]);
  const [currentThreadId, setCurrentThreadId] = useState(null);
  const [savedAITwins, setSavedAITwins] = useState([]);
  const [aiTwinsDiscovered, setAiTwinsDiscovered] = useState([]);
  const [aiTwinsPreset, setAiTwinsPreset] = useState([]);

  useEffect(() => {
    // Load saved AI twins from AsyncStorage on app start
    const loadSavedAITwins = async () => {
      try {
        const storedAITwins = await AsyncStorage.getItem('savedAITwins');
        if (storedAITwins) {
          setSavedAITwins(JSON.parse(storedAITwins));
        }
      } catch (error) {
        console.error('Failed to load saved AI twins', error);
      }
    };

    loadSavedAITwins();
  }, []);

  const addAITwinToHome = async twin => {
    const updatedAITwins = [...savedAITwins, twin];
    setSavedAITwins(updatedAITwins);
    await AsyncStorage.setItem('savedAITwins', JSON.stringify(updatedAITwins));
  };

  const removeAITwinFromHome = async twinId => {
    const updatedAITwins = savedAITwins.filter(twin => twin.id !== twinId);
    setSavedAITwins(updatedAITwins);
    await AsyncStorage.setItem('savedAITwins', JSON.stringify(updatedAITwins));
  };

  const isAITwinAdded = twinKnowledgebaseId => {
    return savedAITwins.some(
      twin => twin.knowledgebaseId === twinKnowledgebaseId,
    );
  };

  // Add this inside your useEffect to load preset AI twins
  useEffect(() => {
    const loadPresetAITwins = async () => {
      try {
        const presetTwins = await getPresetAITwins();
        setAiTwinsPreset(presetTwins);
      } catch (error) {
        console.error('Failed to load preset AI twins', error);
      }
    };

    loadPresetAITwins();
  }, []);

  console.log('aitwinspreset appcontext', aiTwinsPreset);

  return (
    <AppContext.Provider
      value={{
        selectedAI,
        setSelectedAI,
        threads,
        setThreads,
        currentThreadId,
        setCurrentThreadId,
        savedAITwins,
        addAITwinToHome,
        removeAITwinFromHome,
        isAITwinAdded,
        aiTwinsDiscovered,
        setAiTwinsDiscovered,
        aiTwinsPreset,
        setAiTwinsPreset,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
