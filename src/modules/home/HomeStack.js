// HomeStack.js
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from './HomeScreen';
import ChatScreen from '../chat/ChatScreen';
import ThreadsScreen from '../chat/ThreadsScreen';

const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Threads"
        component={ThreadsScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
export default HomeStack;
