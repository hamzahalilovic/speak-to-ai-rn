// App.js

import 'react-native-get-random-values';

import React from 'react';
import {StyleSheet} from 'react-native';

import MainNavigator from './src/navigation/MainNavigator';
import {GluestackUIProvider} from '@gluestack-ui/themed';

import AppWrapper from './src/components/AppWrapper';

import {AppContextProvider} from './src/context/AppContext';

import {config} from '@gluestack-ui/config';

const App = () => {
  return (
    <GluestackUIProvider config={config}>
      <AppWrapper>
        <AppContextProvider>
          <MainNavigator />
        </AppContextProvider>
      </AppWrapper>
    </GluestackUIProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
