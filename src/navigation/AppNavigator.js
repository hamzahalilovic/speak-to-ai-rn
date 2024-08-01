import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

import DiscoverScreen from '../modules/discover/DiscoverScreen';
import ThirdScreen from '../modules/third/ThirdScreen';
import ProfileScreen from '../modules/profile/ProfileScreen';

import HomeStack from '../modules/home/HomeStack';
import CustomHeaderTitle from '../components/CustomHeaderTitle';

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
        name="Home"
        component={HomeStack}
        // options={{
        //   headerTitle: 'App name',
        //   headerStyle: {
        //     backgroundColor: '#fff', // White background
        //   },
        //   headerTitleStyle: {
        //     fontWeight: 'bold',
        //     alignSelf: 'center', // Center the title
        //   },
        //   headerTintColor: '#000', // Black text color
        // }
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          headerLeft: () => <CustomHeaderTitle />, // Use the custom header title component
          headerStyle: {
            backgroundColor: '#FFFFFF', // White background
            height: 80, // Adjust the height to your preference
          },
          headerTintColor: '#2D313B', // Black text color
        }}
      />
      <Tab.Screen
        name="Third"
        component={ThirdScreen}
        options={{
          headerTitle: 'App name',
          headerStyle: {
            backgroundColor: '#fff', // White background
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            alignSelf: 'center', // Center the title
          },
          headerTintColor: '#000', // Black text color
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerTitle: 'App name',
          headerStyle: {
            backgroundColor: '#fff', // White background
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            alignSelf: 'center', // Center the title
          },
          headerTintColor: '#000', // Black text color
        }}
      />
    </Tab.Navigator>
  );
}
export default AppNavigator;
