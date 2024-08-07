import React, {createContext, useContext, useState} from 'react';

const AppContext = createContext();

export const AppContextProvider = ({children}) => {
  const [selectedAI, setSelectedAI] = useState(null);
  const [threads, setThreads] = useState([]);
  const [currentThreadId, setCurrentThreadId] = useState(null);

  return (
    <AppContext.Provider
      value={{
        selectedAI,
        setSelectedAI,
        threads,
        setThreads,
        currentThreadId,
        setCurrentThreadId,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
