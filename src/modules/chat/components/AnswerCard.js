import React from 'react';
import {Box, Card, HStack, Text, Avatar, Button} from 'native-base';

const AnswerCard = ({
  knowledgeBase,
  message,
  handleFeedbackClick,
  language,
}) => (
  <Box className="answer ai">
    <HStack alignItems="center" space="3">
      <Avatar source={{uri: knowledgeBase.avatar}} size="32.5px" />

      <Box>
        <HStack justifyContent="space-between" alignItems="center">
          <Text
            marginLeft="3.75px"
            marginRight="16px"
            fontSize="14px"
            fontWeight="bold">
            {knowledgeBase.title.includes('AI')
              ? knowledgeBase.title.replace('AI', ' AI')
              : knowledgeBase.title}
          </Text>
          <Button size="xs" backgroundColor={'#F5F5F5'}>
            <Text color="#2D313B">Add AI</Text>
          </Button>
        </HStack>
      </Box>
    </HStack>
    <Text mt="2" fontSize="14px" lineHeight="24px" color="#333">
      <Box mt="5px">
        {!message.streaming ? (
          <Box
            className="question-answer"
            fontSize="16px"
            lineHeight="24px"
            color="#333">
            {message.answer}
          </Box>
        ) : (
          <Box className="dots" />
        )}
      </Box>
    </Text>
  </Box>
);

export default AnswerCard;
