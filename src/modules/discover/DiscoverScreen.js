import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const DiscoverScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Discover Screen</Text>
      {/* Implement your discover screen functionality here */}
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

export default DiscoverScreen;
