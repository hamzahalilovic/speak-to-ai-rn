import React from 'react';
import {Box, VStack, Avatar, Text, Button, Icon, HStack} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AITwinCard = ({
  name,
  description,
  onChatPress,
  avatar,
  onAddOrRemove,
  isAdded,
}) => {
  return (
    <Box
      bg="#f2f2f2" // Background color for the card
      borderRadius="10px" // Rounded corners
      padding="16px" // Padding inside the card
      alignItems="center" // Center items horizontally
      shadow="2" // Add slight shadow for elevation
      width="100%"
      maxWidth="300px" // Max width for the card
    >
      <Avatar size={65} source={{uri: avatar}} mb="12px" bg="transparent" />
      <Text fontWeight="bold" fontSize="16px" mb="4px">
        {name}
      </Text>
      <Text fontSize="14px" color="#666" mb="12px" textAlign="center">
        {description}
      </Text>
      <VStack space={3}>
        <Button
          bg="#2d2d2d" // Button background color
          _text={{color: '#fff'}} // Button text color
          onPress={onChatPress} // Handle press event
        >
          Chat
        </Button>
        <Button
          size={'xs'}
          bg={isAdded ? '#4CAF50' : '#f2f2f2'} // Change background color based on isAdded state
          _text={{color: isAdded ? '#fff' : '#2D313B'}} // Change text color based on isAdded state
          onPress={onAddOrRemove} // Handle add/remove event
          disabled={isAdded} //
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
