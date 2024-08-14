import React from 'react';
import {
  Box,
  VStack,
  Avatar,
  Text,
  Button,
  ButtonText,
  Icon,
  HStack,
  Pressable,
  Image,
  ButtonIcon,
  AvatarImage,
} from '@gluestack-ui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AITwinCard = ({
  name,
  description,
  onChatPress,
  avatar,
  onAddOrRemove,
  isAdded,
  onDelete,
  deletable,
}) => {
  return (
    <Box
      bg="#f2f2f2"
      borderRadius={10}
      padding={16}
      alignItems="center"
      shadow={2}
      position="relative">
      {deletable && (
        <Pressable
          onPress={onDelete}
          position="absolute"
          top={4}
          right={4}
          zIndex={1}>
          <Icon as={Ionicons} name="close" size={25} color="red" />
        </Pressable>
      )}
      <Avatar size="lg" bg="transparent">
        <AvatarImage
          source={{uri: avatar}}
          mb={12}
          bg="transparent"
          alt={`${name}-avatar`}
        />
      </Avatar>
      <Box h={25}>
        <Text fontWeight="bold" fontSize={14} mb={4}>
          {name && name.length > 20
            ? `${name.substring(0, 19)}...`
            : name || 'No name available'}
        </Text>
      </Box>
      <Box h={45}>
        <Text fontWeight="normal" fontSize={12} mb={4}>
          {description && description.length > 50
            ? `${description.substring(0, 50)}...`
            : description || 'No description available'}
        </Text>
      </Box>
      <Button size="sm" bg="#2d2d2d" onPress={onChatPress} mt={4}>
        <ButtonText color="#fff">Chat</ButtonText>
      </Button>
      <Button
        disabled={isAdded}
        size="xs"
        variant="link"
        onPress={onAddOrRemove}>
        <ButtonText color={isAdded ? '#4CAF50' : '#2d2d2d'}>
          {isAdded ? 'Added' : '+ Add AI'}
        </ButtonText>
      </Button>
    </Box>
  );
};

export default AITwinCard;
