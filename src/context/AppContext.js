import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

export const AppContextProvider = ({children}) => {
  const [selectedAI, setSelectedAI] = useState(null);
  const [threads, setThreads] = useState([]);
  const [currentThreadId, setCurrentThreadId] = useState(null);
  const [savedAITwins, setSavedAITwins] = useState([]);

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
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
