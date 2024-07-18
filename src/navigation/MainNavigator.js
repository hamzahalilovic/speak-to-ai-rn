import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';

import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import SplashScreen from '../modules/launch/SplashScreen';

function MainNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [continueAsGuest, setContinueAsGuest] = useState(true);

  return (
    <NavigationContainer>
      {!isAuthenticated && !continueAsGuest ? (
        <SplashScreen
          setIsAuthenticated={setIsAuthenticated}
          setContinueAsGuest={setContinueAsGuest}
        />
      ) : isAuthenticated ? (
        <AppNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}

export default MainNavigator;
