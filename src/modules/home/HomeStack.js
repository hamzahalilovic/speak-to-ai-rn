import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from './HomeScreen';
import ChatScreen from '../chat/ChatScreen';
import CustomHeaderTitle from '../../components/CustomHeaderTitle';

const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: () => <CustomHeaderTitle />, // Use the custom header title component
          headerStyle: {
            backgroundColor: '#FFFFFF', // White background
            height: 80, // Adjust the height to your preference
          },
          headerTintColor: '#2D313B', // Black text color
        }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          headerTitle: 'Speaker AI',
          headerBackTitleVisible: false,
          headerTintColor: '#000',
          headerStyle: {backgroundColor: '#f1f1f1'},
          headerTitleStyle: {fontWeight: 'bold'},
          headerLeft: props => (
            <Icon name="arrow-back-outline" size={24} color="#000" {...props} />
          ),
        }}
      />
    </Stack.Navigator>
  );
}
export default HomeStack;
