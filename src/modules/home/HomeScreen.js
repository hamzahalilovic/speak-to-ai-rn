import React from 'react';
import {View, FlatList, Alert, TouchableOpacity} from 'react-native';
import {
  Box,
  HStack,
  Text,
  Avatar,
  AvatarImage,
  Menu,
  Icon,
  Button,
  MenuItem,
  VStack,
} from '@gluestack-ui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useAppContext} from '../../context/AppContext';
import HapticFeedback from 'react-native-haptic-feedback';
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
    HapticFeedback.trigger('impactLight');
    setSelectedAI(twin);
    navigation.navigate('Chat');
  };

  return (
    <View
      style={{flex: 1, padding: 16, paddingTop: 55, backgroundColor: '#fff'}}>
      <Text fontSize={24} fontWeight={600} mb={15}>
        Your AI's
      </Text>
      {savedAITwins.length > 0 ? null : (
        <Text fontSize={18} fontWeight={40} mt={35}>
          Go to Discover to add AI Twins to your Home
        </Text>
      )}

      <FlatList
        data={savedAITwins}
        keyExtractor={item => item.knowledgebaseId}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => handleChatPress(item)}>
            <HStack
              space="sm"
              alignItems="center"
              padding={4}
              borderBottomWidth={1}
              borderBottomColor="lightgray"
              accessibilityRole="button"
              accessibilityLabel={`Chat with ${item.title}`}
              accessibilityHint="Double tap to chat">
              <Avatar bg="transparent" size="md" mr={4}>
                <AvatarImage alt="avatar" source={{uri: item.avatar}} />
              </Avatar>
              <Text
                fontSize={16}
                flex={1}
                textBreakStrategy="simple"
                textValue={item.title}>
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
                <MenuItem onPress={() => handleShowInfo(item)} textValue="Info">
                  <HStack alignItems="center">
                    <Icon
                      as={Ionicons}
                      name="information-circle"
                      size="sm"
                      mr={2}
                    />
                    <Text>Info</Text>
                  </HStack>
                </MenuItem>
                <MenuItem
                  onPress={() => handleRemoveTwin(item.knowledgebaseId)}>
                  <HStack alignItems="center">
                    <Icon
                      as={Ionicons}
                      name="trash"
                      size="sm"
                      color="red"
                      mr={2}
                    />
                    <Text color="red">Remove</Text>
                  </HStack>
                </MenuItem>
              </Menu>
            </HStack>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default HomeScreen;
