import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const CustomHeaderTitle = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>App name</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32, // Vertical padding
    paddingHorizontal: 16, // Optional horizontal padding
  },
  title: {
    fontSize: 14,
    color: '#2D313B',
    fontWeight: 'bold',
  },
});

export default CustomHeaderTitle;
