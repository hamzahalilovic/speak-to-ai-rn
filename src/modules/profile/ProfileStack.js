import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ProfileScreen from './ProfileScreen';
// import ChangeThemeScreen from './ChangeThemeScreen'; // Replace with your actual screen
import PaymentScreen from './PaymentScreen'; // Replace with your actual screen
// import NotificationsScreen from './NotificationsScreen'; // Replace with your actual screen
// import AccountSettingsScreen from './AccountSettingsScreen'; // Replace with your actual screen
// import HelpSupportScreen from './HelpSupportScreen'; // Replace with your actual screen

import PresetAITwinsScreen from './PresetAITwinsScreen';

const Stack = createStackNavigator();

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen name="ChangeTheme" component={ChangeThemeScreen} /> */}
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="PresetAITwins" component={PresetAITwinsScreen} />
      {/* <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} /> */}
    </Stack.Navigator>
  );
}

export default ProfileStack;
