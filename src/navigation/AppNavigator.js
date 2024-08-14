// AppNavigator.js
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {Icon} from '@gluestack-ui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import DiscoverScreen from '../modules/discover/DiscoverScreen';

import QRCodeScannerScreen from '../modules/qr/QRCodeScanner';
import ProfileScreen from '../modules/profile/ProfileScreen';

import HomeStack from '../modules/home/HomeStack';
import ProfileStack from '../modules/profile/ProfileStack';
import ScannerStack from '../modules/qr/ScannerStack';

const Tab = createBottomTabNavigator();

const TabIcon = ({route, focused, color, size}) => {
  let iconName;
  let IconComponent = Ionicons; // Default to Ionicons

  if (route.name === 'HomeStack') {
    iconName = focused ? 'home' : 'home-outline';
    IconComponent = Ionicons;
  } else if (route.name === 'Discover') {
    iconName = focused ? 'star' : 'star-outline';
    IconComponent = Ionicons;
  } else if (route.name === 'ScannerStack') {
    IconComponent = MaterialCommunityIcons;
    iconName = focused ? 'account-group' : 'account-group-outline';
  } else if (route.name === 'ProfileStack') {
    iconName = focused ? 'person' : 'person-outline';
    IconComponent = MaterialIcons;
  }

  return <Icon as={IconComponent} name={iconName} size={size} color={color} />;
};

const AppNavigator = () => (
  <Tab.Navigator
    screenOptions={({route}) => ({
      tabBarIcon: props => <TabIcon route={route} {...props} />,
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
      options={{headerShown: false}}
    />
    <Tab.Screen
      name="ScannerStack"
      component={ScannerStack}
      options={{headerShown: false, tabBarLabel: 'Find AI Twins'}}
    />
    <Tab.Screen
      name="ProfileStack"
      component={ProfileStack}
      options={{headerShown: false, tabBarLabel: 'Profile'}}
    />
  </Tab.Navigator>
);

export default AppNavigator;
