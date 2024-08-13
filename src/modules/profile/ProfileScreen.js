import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Text, VStack, HStack, Icon} from '@gluestack-ui/themed-native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProfileScreen = ({navigation}) => {
  return (
    <View
      style={{flex: 1, padding: 16, backgroundColor: '#fff', paddingTop: 55}}>
      <Text fontSize={24} fontWeight={600} mb={4}>
        Profile & Settings
      </Text>

      <VStack space={4}>
        <TouchableOpacity onPress={() => navigation.navigate('ChangeTheme')}>
          <HStack
            padding={3}
            backgroundColor="#f5f5f5"
            borderRadius="10px"
            alignItems="center"
            space={3}>
            <Icon as={Ionicons} name="color-palette" size="lg" />
            <Text fontSize={16}>Change Theme</Text>
          </HStack>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('PresetAITwins')}>
          <HStack
            padding={3}
            backgroundColor="#f5f5f5"
            borderRadius="10px"
            alignItems="center"
            space={3}>
            <Icon as={Ionicons} name="help-circle" size="lg" />
            <Text fontSize={16}>Preset AI Twins</Text>
          </HStack>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('HelpSupport')}>
          <HStack
            padding={3}
            backgroundColor="#f5f5f5"
            borderRadius="10px"
            alignItems="center"
            space={3}>
            <Icon as={Ionicons} name="help-circle" size="lg" />
            <Text fontSize={16}>Help & Support</Text>
          </HStack>
        </TouchableOpacity>
      </VStack>
    </View>
  );
};

export default ProfileScreen;
