import React from 'react';
import {
  Box,
  HStack,
  Text,
  Avatar,
  Button,
  Icon,
  ButtonText,
} from '@gluestack-ui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {useAppContext} from '../../../context/AppContext';

const AnswerCard = ({
  knowledgeBase,
  message,
  handleFeedbackClick,
  language,
  isAdded, // Receive this as prop
  addAITwinToHome, // Receive this as prop
}) => {
  const handleAddTwin = () => {
    if (!isAdded) {
      addAITwinToHome(knowledgeBase);
    }
  };
  console.log('message in answer card', message);
  return (
    <Box padding={4} borderColor="gray.200">
      <HStack alignItems="center" space="3">
        <Avatar source={{uri: knowledgeBase.avatar}} size="32.5px" />
        <Box flex={1}>
          <HStack justifyContent="space-between" alignItems="center">
            <Text fontSize={14} fontWeight="bold">
              {knowledgeBase.title}
            </Text>
            <Button
              size="xs"
              backgroundColor={isAdded ? '#4CAF50' : '#F5F5F5'}
              onPress={handleAddTwin}
              leftIcon={
                isAdded && (
                  <Icon as={Ionicons} name="checkmark" size="sm" color="#fff" />
                )
              }>
              <Text color={isAdded ? '#fff' : '#2D313B'}>
                <ButtonText>{isAdded ? 'Added' : 'Add AI'}</ButtonText>
              </Text>
            </Button>
          </HStack>
        </Box>
      </HStack>
      <Text mt="2" fontSize={14} color="#333">
        {message.answer}
      </Text>
    </Box>
  );
};
export default AnswerCard;
