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
          headerStyle: {
            backgroundColor: '#FFFFFF',
            height: 80,
          },
          headerTintColor: '#2D313B',
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
          headerBackTitleVisible: false,
          headerTintColor: '#000',
          headerStyle: {backgroundColor: '#f1f1f1'},
          headerTitleStyle: {fontWeight: 'bold'},
        }}
      />
    </Stack.Navigator>
  );
}
export default HomeStack;
