import React from 'react';
import {View, FlatList, Alert, TouchableOpacity} from 'react-native';
import {
  Box,
  HStack,
  Text,
  Avatar,
  Menu,
  Icon,
  Button,
} from '@gluestack-ui/themed-native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useAppContext} from '../../context/AppContext';

const HomeScreen = () => {
  const navigation = useNavigation();
  const {savedAITwins, removeAITwinFromHome, setSelectedAI} = useAppContext();

  console.log('saved twins home', savedAITwins);

  const handleRemoveTwin = twinId => {
    Alert.alert(
      'Remove AI Twin',
      'Are you sure you want to remove this AI Twin?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeAITwinFromHome(twinId),
        },
      ],
      {cancelable: true},
    );
  };

  const handleShowInfo = twin => {
    Alert.alert(
      'AI Twin Information',
      `Name: ${twin.name}\nDescription: ${twin.description}`,
    );
  };

  const handleChatPress = twin => {
    setSelectedAI(twin);
    navigation.navigate('Chat');
  };

  return (
    <View
      style={{flex: 1, padding: 16, paddingTop: 55, backgroundColor: '#fff'}}>
      <Text fontSize={24} fontWeight={600} mb={4}>
        Your AI's
      </Text>
      <FlatList
        data={savedAITwins}
        keyExtractor={item => item.knowledgebaseId}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => handleChatPress(item)}>
            <HStack
              alignItems="center"
              padding={4}
              borderBottomWidth={1}
              borderBottomColor="gray.200">
              <Avatar
                bg="transparent"
                source={{uri: item.avatar}}
                size="40px"
                mr={4}
              />
              <Text fontSize={16} flex={1}>
                {item.title}
              </Text>
              <Menu
                w="190"
                trigger={triggerProps => {
                  return (
                    <TouchableOpacity {...triggerProps}>
                      <Icon as={Ionicons} name="ellipsis-vertical" size="lg" />
                    </TouchableOpacity>
                  );
                }}>
                <Menu.Item onPress={() => handleShowInfo(item)}>
                  <HStack alignItems="center">
                    <Icon
                      as={Ionicons}
                      name="information-circle"
                      size="sm"
                      mr={2}
                    />
                    <Text>Info</Text>
                  </HStack>
                </Menu.Item>
                <Menu.Item onPress={() => handleRemoveTwin(item.id)}>
                  <HStack alignItems="center">
                    <Icon
                      as={Ionicons}
                      name="trash"
                      size="sm"
                      color="red.500"
                      mr={2}
                    />
                    <Text color="red.500">Remove</Text>
                  </HStack>
                </Menu.Item>
                <Menu.Item onPress={() => handleChatPress(item)}>
                  <HStack alignItems="center">
                    {/* <Icon as={Ionicons} name="chatbubbles" size="sm" mr={2} /> */}
                    <Text>Chat</Text>
                  </HStack>
                </Menu.Item>
              </Menu>
            </HStack>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default HomeScreen;
