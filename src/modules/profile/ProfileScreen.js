import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Text, Box, VStack, HStack, Icon} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProfileScreen = ({navigation}) => {
  const settingsItems = [
    {label: 'Change Theme', icon: 'color-palette', screen: 'ChangeTheme'},
    {label: 'Payment', icon: 'card', screen: 'Payment'},
    {label: 'Notifications', icon: 'notifications', screen: 'Notifications'},
    {label: 'Account Settings', icon: 'settings', screen: 'AccountSettings'},
    {label: 'Help & Support', icon: 'help-circle', screen: 'HelpSupport'},
    {label: 'Preset AI Twins', icon: 'help-circle', screen: 'PresetAITwins'},
  ];

  return (
    <View
      style={{flex: 1, padding: 16, backgroundColor: '#fff', paddingTop: 55}}>
      <Text fontSize={24} fontWeight={600} lineHeight={33} mb={4}>
        Profile & Settings
      </Text>

      <VStack space={4}>
        {settingsItems.map(item => (
          <TouchableOpacity
            key={item.label}
            onPress={() => navigation.navigate(item.screen)}>
            <HStack
              padding={3}
              backgroundColor="#f5f5f5"
              borderRadius="10px"
              alignItems="center"
              space={3}>
              <Icon as={Ionicons} name={item.icon} size="lg" />
              <Text fontSize="16px">{item.label}</Text>
            </HStack>
          </TouchableOpacity>
        ))}
      </VStack>
    </View>
  );
};

export default ProfileScreen;
