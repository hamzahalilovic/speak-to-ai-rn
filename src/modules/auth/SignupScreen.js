import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';

const SignupScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text>Signup Screen</Text>
      {/* Implement your signup functionality here */}
      <Button
        title="Go to Login"
        onPress={() => navigation.navigate('Login')}
      />
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

export default SignupScreen;
