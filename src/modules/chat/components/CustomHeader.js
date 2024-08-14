import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {HStack, Text, Button, ButtonIcon} from '@gluestack-ui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CustomHeader = ({
  knowledgebaseId,
  handleNewThread,
  name,
  isNewThreadDisabled,
  avatar,
}) => {
  const navigation = useNavigation();

  return (
    <HStack
      justifyContent="space-between"
      alignItems="center"
      padding={16}
      marginTop={35}
      bg="#f2f2f2">
      {/* Back Button */}
      <Button onPress={() => navigation.goBack()} variant="link">
        <ButtonIcon as={Ionicons} name="arrow-back" size={24} color="black" />
      </Button>

      {/* AI Twin Name */}
      <Text fontWeight="bold" fontSize={20}>
        {name || 'AI Twin'}
      </Text>

      {/* Buttons for Threads and New Thread */}
      <HStack space="md">
        <Button
          onPress={() => navigation.navigate('Threads', {knowledgebaseId})}
          variant="link">
          <ButtonIcon as={Ionicons} name="list" size={24} color="black" />
        </Button>
        <Button
          onPress={handleNewThread}
          isDisabled={isNewThreadDisabled}
          variant="link">
          <ButtonIcon as={Ionicons} name="add-circle" size={24} color="black" />
        </Button>
      </HStack>
    </HStack>
  );
};

export default CustomHeader;
