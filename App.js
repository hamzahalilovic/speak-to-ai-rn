// App.js

import 'react-native-get-random-values';

import React from 'react';
import {StyleSheet} from 'react-native';

import MainNavigator from './src/navigation/MainNavigator';
import {NativeBaseProvider} from '@gluestack-ui/themed-native-base';

import AppWrapper from './src/components/AppWrapper';

import {AppContextProvider} from './src/context/AppContext';

const App = () => {
  return (
    <NativeBaseProvider>
      <AppWrapper>
        <AppContextProvider>
          <MainNavigator />
        </AppContextProvider>
      </AppWrapper>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
