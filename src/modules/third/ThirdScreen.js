import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const ThirdScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Third Screen</Text>
      {/* Implement your third screen functionality here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ThirdScreen;
