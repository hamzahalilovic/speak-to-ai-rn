// AppNavigator.js
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import DiscoverScreen from '../modules/discover/DiscoverScreen';

import QRCodeScannerScreen from '../modules/qr/QRCodeScanner';
import ProfileScreen from '../modules/profile/ProfileScreen';

import HomeStack from '../modules/home/HomeStack';
import ProfileStack from '../modules/profile/ProfileStack';
import ScannerStack from '../modules/qr/ScannerStack';

const Tab = createBottomTabNavigator();

function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'HomeStack') {
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'Discover') {
            iconName = focused ? 'star' : 'star-outline';
          } else if (route.name === 'ScannerStack') {
            iconName = focused ? 'qr-code' : 'qr-code-outline';
          } else if (route.name === 'ProfileStack') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Icon name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: '#9682E8',
        tabBarInactiveTintColor: 'white',
        tabBarStyle: {
          backgroundColor: '#000',
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          height: 80,
        },
      })}>
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{headerShown: false, tabBarLabel: 'Home'}}
      />
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="ScannerStack"
        component={ScannerStack}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{headerShown: false, tabBarLabel: 'Profile'}}
      />
    </Tab.Navigator>
  );
}
export default AppNavigator;
