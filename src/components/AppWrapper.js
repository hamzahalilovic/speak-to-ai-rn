import React from 'react';
import {View, StyleSheet} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

const AppWrapper = ({children}) => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
        <View style={styles.container}>{children}</View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingTop: 0,
    marginBottom: 0, // Ensure there's no unwanted padding
    paddingBottom: 0, // Ensure there's no unwanted padding
    paddingHorizontal: 0, // Ensure there's no unwanted padding
  },
});

export default AppWrapper;
