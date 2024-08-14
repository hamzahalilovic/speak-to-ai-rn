import React from 'react';
import {StyleSheet} from 'react-native';

import {View, Text} from '@gluestack-ui/themed';

const QuestionCard = ({message}) => {
  return (
    <View className="question user" style={styles.container}>
      <Text style={styles.text}>{message.value}</Text>
      <View style={styles.tail}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2d2d2d', // Dark background color for the bubble
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    maxWidth: '80%', // Adjust the width to fit content
    alignSelf: 'flex-end', // Align to the right
    position: 'relative',
    marginVertical: 10,
  },
  text: {
    color: '#FFFFFF', // White text color
    fontSize: 14,
    lineHeight: 24,
  },
  tail: {
    position: 'absolute',
    right: 5,
    bottom: -3,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    borderTopWidth: 10,
    borderTopColor: '#2d2d2d',
  },
});

export default QuestionCard;
