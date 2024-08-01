import React from 'react';
import {Box, VStack, Avatar, Text, Button} from 'native-base';

const AITwinCard = ({name, description, onChatPress}) => {
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
      <Avatar
        size="lg"
        bg="#2d2d2d" // Background color for avatar
        mb="12px"
      />
      <Text fontWeight="bold" fontSize="16px" mb="4px">
        {name}
      </Text>
      <Text fontSize="14px" color="#666" mb="12px" textAlign="center">
        {description}
      </Text>
      <Button
        bg="#2d2d2d" // Button background color
        _text={{color: '#fff'}} // Button text color
        onPress={onChatPress} // Handle press event
      >
        Chat
      </Button>
    </Box>
  );
};

export default AITwinCard;
