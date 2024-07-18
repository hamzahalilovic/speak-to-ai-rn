import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

const SplashScreen = ({setIsAuthenticated, setContinueAsGuest}) => {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.letter}>S</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Sign up / Log in"
          onPress={() => setIsAuthenticated(false)}
          color="#000"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Continue as guest"
          onPress={() => setContinueAsGuest(true)}
          color="#aaa"
        />
      </View>
      <Text style={styles.footer}>made by prifina</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  box: {
    marginBottom: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  letter: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000',
  },
  buttonContainer: {
    marginVertical: 10,
    width: '80%',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    color: '#aaa',
  },
});

export default SplashScreen;
