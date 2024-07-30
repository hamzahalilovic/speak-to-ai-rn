// App.js

import 'react-native-get-random-values';

import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

import MainNavigator from './src/navigation/MainNavigator';
import {NativeBaseProvider} from 'native-base';

const App = () => {
  return (
    <NativeBaseProvider>
      <SafeAreaView style={styles.container}>
        <MainNavigator />
      </SafeAreaView>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
