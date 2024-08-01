import React from 'react';
import {View, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ChatInput = React.forwardRef(
  ({value, onChangeText, onSubmitEditing, placeholder, ...rest}, ref) => {
    return (
      <View style={styles.container}>
        <TextInput
          ref={ref} // Pass down the ref
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          placeholder={placeholder}
          placeholderTextColor="#aaa" // Adjust the placeholder color
          {...rest} // Spread any additional props
        />
        <TouchableOpacity onPress={onSubmitEditing} style={styles.sendButton}>
          <Icon name="send" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#2d2d2d',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
  },
});

export default ChatInput;
