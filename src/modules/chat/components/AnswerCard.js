import React, {useEffect, useState} from 'react';
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
import HapticFeedback from 'react-native-haptic-feedback';
import {useAppContext} from '../../../context/AppContext';

const AnswerCard = ({
  knowledgeBase,
  message,
  handleFeedbackClick,
  language,
  isAdded,
  addAITwinToHome,
}) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (message.isNew && message.streaming === false && displayedText === '') {
      const totalDuration = 2000; // Total duration in milliseconds for the entire message
      const intervalDuration = totalDuration / message.answer.length;

      let index = 0;
      const interval = setInterval(() => {
        setDisplayedText(prev => prev + message.answer[index]);
        index++;

        // Trigger haptic feedback for each letter
        HapticFeedback.trigger('impactLight');

        if (index === message.answer.length) {
          clearInterval(interval);
          message.isNew = false; // Mark message as old after effect is done
        }
      }, intervalDuration); // Use calculated interval duration

      return () => clearInterval(interval);
    } else if (!message.isNew) {
      setDisplayedText(message.answer);
    }
  }, [message.streaming]);

  const handleAddTwin = () => {
    if (!isAdded) {
      addAITwinToHome(knowledgeBase);
    }
  };

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
            {displayedText}
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default AnswerCard;
