// App.tsx
import React from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import WebViewComponent from './WebViewComponent';
import MainNavigator from './src/navigation/MainNavigator';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <MainNavigator />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
