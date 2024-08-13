import React from 'react';
import {
  Box,
  VStack,
  Avatar,
  Text,
  Button,
  Icon,
  HStack,
  Pressable,
  Image,
} from 'native-base';
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
      borderRadius="10px"
      padding="16px"
      alignItems="center"
      shadow="2"
      width="100%"
      maxWidth="300px"
      position="relative" // To position the delete button
    >
      {deletable && (
        <Pressable
          onPress={onDelete}
          position="absolute"
          top={2}
          right={1}
          zIndex={1}>
          <Icon as={Ionicons} name="trash" size={25} color="red.500" />
        </Pressable>
      )}

      <Image
        size={65}
        source={{uri: avatar}}
        mb="12px"
        bg="transparent"
        alt={`${name}-avatar`}
      />
      <Text fontWeight="bold" fontSize="16px" mb="4px">
        {name}
      </Text>
      <Text fontSize="14px" color="#666" mb="12px" textAlign="center">
        {description.length > 20
          ? `${description.substring(0, 20)}...`
          : description}
      </Text>
      <VStack space={3}>
        <Button bg="#2d2d2d" _text={{color: '#fff'}} onPress={onChatPress}>
          Chat
        </Button>
        <Button
          size={'xs'}
          bg={isAdded ? '#4CAF50' : '#f2f2f2'}
          _text={{color: isAdded ? '#fff' : '#2D313B'}}
          onPress={onAddOrRemove}
          leftIcon={
            isAdded ? (
              <Icon as={Ionicons} name="checkmark" color="#fff" size="sm" />
            ) : (
              <Icon as={Ionicons} name="add" color="#2D313B" size="sm" />
            )
          }>
          {isAdded ? 'Added' : 'Add AI'}
        </Button>
      </VStack>
    </Box>
  );
};

export default AITwinCard;
