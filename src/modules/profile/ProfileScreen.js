import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Text, VStack, HStack, Icon, Box} from '@gluestack-ui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Fontisto from 'react-native-vector-icons/Fontisto';
import LottieView from 'lottie-react-native';

const ProfileScreen = ({navigation}) => {
  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        backgroundColor: '#f9f9f9',
        paddingTop: 55,
      }}>
      <Text fontSize={24} fontWeight={600} mb={35}>
        Profile & Settings
      </Text>

      <VStack space="md">
        <TouchableOpacity onPress={() => navigation.navigate('ChangeTheme')}>
          <HStack
            padding={8}
            backgroundColor="#fff"
            borderRadius={10}
            alignItems="center"
            space="sm"
            shadow={2}
            borderColor="lightgray">
            <Icon as={Ionicons} name="color-palette" size="xl" />

            <Text fontSize={22} fontWeight={500}>
              Change Theme
            </Text>
          </HStack>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('PresetAITwins')}>
          <HStack
            padding={8}
            backgroundColor="#fff"
            borderRadius={10}
            alignItems="center"
            space="sm"
            shadow={2}
            borderColor="lightgray">
            <Icon as={Fontisto} name="persons" size="xl" />

            <Text fontSize={22} fontWeight={500}>
              Preset AI Twins
            </Text>
          </HStack>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('HelpSupport')}>
          <HStack
            padding={8}
            backgroundColor="#fff"
            borderRadius={10}
            alignItems="center"
            space="sm"
            shadow={2}
            borderColor="lightgray">
            <Icon as={Ionicons} name="help-circle-outline" size={'xl'} />

            <Text fontSize={22} fontWeight={500}>
              Support
            </Text>
          </HStack>
        </TouchableOpacity>
        {/* <LottieView
          source={require('../../assets/lottie-animations/success-animation.json')}
          style={{width: '100%', height: '100%'}}
          autoPlay
          loop
        /> */}
      </VStack>
    </View>
  );
};

export default ProfileScreen;
