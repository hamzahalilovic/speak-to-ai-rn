import React from 'react';
import {
  Box,
  HStack,
  Text,
  Avatar,
  AvatarImage,
  Button,
  Icon,
  ButtonText,
} from '@gluestack-ui/themed';
import LottieView from 'lottie-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useAppContext} from '../../../context/AppContext';

const AnswerCard = ({
  knowledgeBase,
  message,
  handleFeedbackClick,
  language,
  isAdded,
  addAITwinToHome,
}) => {
  const handleAddTwin = () => {
    if (!isAdded) {
      addAITwinToHome(knowledgeBase);
    }
  };
  console.log('message in answer card', message);

  return (
    <Box padding={12} borderColor="gray">
      <HStack alignItems="center" space="sm">
        <Avatar size={32.5} bg="transparent">
          <AvatarImage alt="avatar" source={{uri: knowledgeBase.avatar}} />
        </Avatar>
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
              <ButtonText>{isAdded ? 'Added' : 'Add AI'}</ButtonText>
            </Button>
          </HStack>
        </Box>
      </HStack>
      <Box mt={12}>
        {message.streaming ? (
          <LottieView
            source={require('../../../assets/lottie-animations/answer-chat-animation.json')}
            autoPlay
            loop
            style={{height: 75}}
          />
        ) : (
          <Text fontSize={14} color="#333">
            {message.answer}
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default AnswerCard;
