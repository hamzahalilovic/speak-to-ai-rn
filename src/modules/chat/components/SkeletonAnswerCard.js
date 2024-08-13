import React from 'react';
import {
  Box,
  HStack,
  VStack,
  Skeleton,
  Avatar,
} from '@gluestack-ui/themed-native-base';

const SkeletonAnswerCard = () => {
  return (
    <Box padding={4}>
      <HStack alignItems="center" space="3">
        <Skeleton
          borderWidth={1}
          borderColor="coolGray.200"
          endColor="warmGray.50"
          size="10"
          rounded="full"
          mb={5}
        />

        <Box flex={1}>
          <HStack justifyContent="space-between" alignItems="center">
            <Skeleton.Text
              lines={1}
              width="30%"
              startColor="coolGray.200"
              endColor="coolGray.300"
            />

            <Skeleton.Text
              lines={1}
              width="60px"
              startColor="coolGray.300"
              endColor="coolGray.400"
            />
          </HStack>
        </Box>
      </HStack>

      <Skeleton.Text
        mt="2"
        lines={3}
        space="2"
        width="100%"
        startColor="coolGray.200"
        endColor="coolGray.300"
      />
    </Box>
  );
};

export default SkeletonAnswerCard;
