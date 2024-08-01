import React, {createContext, useState, useContext} from 'react';

const AppContext = createContext();

export const AppContextProvider = ({children}) => {
  const [selectedAI, setSelectedAI] = useState(null);

  return (
    <AppContext.Provider value={{selectedAI, setSelectedAI}}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
