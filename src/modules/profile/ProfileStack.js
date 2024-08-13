import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ProfileScreen from './ProfileScreen';

import PaymentScreen from './PaymentScreen'; // Replace with your actual screen

import PresetAITwinsScreen from './PresetAITwinsScreen';

import ChangeTheme from './ChangeThemeScreen';
import HelpSupportScreen from './HelpSupportScreen';

const Stack = createStackNavigator();

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name="ChangeTheme" component={ChangeTheme} />
      <Stack.Screen name="PresetAITwins" component={PresetAITwinsScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
    </Stack.Navigator>
  );
}

export default ProfileStack;
