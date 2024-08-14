import React from 'react';
import {Center, Skeleton, VStack} from '@gluestack-ui/themed';

const SkeletonAvatarDescription = () => {
  return (
    <Center
      // w="100%"
      style={{
        paddingHorizontal: 24,
        marginTop: 32,
      }}>
      <VStack
        w="90%"
        space={6}
        rounded="md"
        alignItems="center"
        _dark={{
          borderColor: 'coolGray.500',
        }}
        _light={{
          borderColor: 'coolGray.200',
        }}>
        <Skeleton
          borderWidth={1}
          borderColor="coolGray.200"
          endColor="warmGray.50"
          size="120"
          rounded="full"
        />

        <Skeleton.Text lines={3} alignItems="center" />
      </VStack>
    </Center>
  );
};

export default SkeletonAvatarDescription;
