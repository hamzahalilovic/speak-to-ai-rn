import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  getPresetAITwins,
  saveDiscoveredAITwins,
  getDiscoveredAITwins,
} from '../modules/discover/utils/aiTwinsStorage';

const AppContext = createContext();

export const AppContextProvider = ({children}) => {
  const [selectedAI, setSelectedAI] = useState(null);
  const [threads, setThreads] = useState([]);
  const [currentThreadId, setCurrentThreadId] = useState(null);
  const [savedAITwins, setSavedAITwins] = useState([]);
  const [aiTwinsDiscovered, setAiTwinsDiscovered] = useState([]);
  const [aiTwinsPreset, setAiTwinsPreset] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [storedAITwins, presetTwins, discoveredTwins] = await Promise.all(
          [
            AsyncStorage.getItem('savedAITwins'),
            getPresetAITwins(),
            getDiscoveredAITwins(),
          ],
        );

        if (storedAITwins) {
          setSavedAITwins(JSON.parse(storedAITwins));
        }

        if (presetTwins) {
          setAiTwinsPreset(presetTwins);
        }

        if (discoveredTwins) {
          setAiTwinsDiscovered(discoveredTwins);
        }
      } catch (error) {
        console.error('Failed to load AI twins data', error);
      }
    };

    loadData();
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

  const addDiscoveredAITwin = async twin => {
    const updatedAITwins = [...aiTwinsDiscovered, twin];
    setAiTwinsDiscovered(updatedAITwins);
    await saveDiscoveredAITwins(updatedAITwins);
  };

  const togglePresetAITwin = async twin => {
    const updatedTwins = aiTwinsPreset.some(item => item.id === twin.id)
      ? aiTwinsPreset.filter(item => item.id !== twin.id)
      : [...aiTwinsPreset, twin];

    setAiTwinsPreset(updatedTwins);
    await AsyncStorage.setItem('/aiTwins/preset', JSON.stringify(updatedTwins));
  };

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
        addDiscoveredAITwin,
        aiTwinsPreset,
        setAiTwinsPreset,
        togglePresetAITwin,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
