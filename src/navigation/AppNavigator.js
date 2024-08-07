// AppNavigator.js
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import DiscoverScreen from '../modules/discover/DiscoverScreen';
import ThirdScreen from '../modules/third/ThirdScreen';
import ProfileScreen from '../modules/profile/ProfileScreen';

import HomeStack from '../modules/home/HomeStack';

const Tab = createBottomTabNavigator();

function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'Discover') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Third') {
            iconName = focused ? 'qr-code' : 'qr-code-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Icon name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: 'purple',
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
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          headerStyle: {
            backgroundColor: '#FFFFFF',
            height: 80,
          },
          headerTintColor: '#2D313B',
        }}
      />
      <Tab.Screen
        name="Third"
        component={ThirdScreen}
        options={{
          headerTitle: 'App name',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            alignSelf: 'center',
          },
          headerTintColor: '#000',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerTitle: 'App name',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            alignSelf: 'center',
          },
          headerTintColor: '#000',
        }}
      />
    </Tab.Navigator>
  );
}
export default AppNavigator;
