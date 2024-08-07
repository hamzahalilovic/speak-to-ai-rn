import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {HStack, Button, Text, IconButton} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CustomHeader = ({
  knowledgebaseId,
  handleNewThread,
  name,
  isNewThreadDisabled,
}) => {
  const navigation = useNavigation();

  return (
    <HStack
      justifyContent="space-between"
      alignItems="center"
      padding="16px"
      marginTop={35}
      bg="#f2f2f2">
      {/* Back Button */}
      <IconButton
        icon={<Ionicons name="arrow-back" size={24} color="black" />}
        onPress={() => navigation.goBack()}
      />

      {/* AI Twin Name */}
      <Text fontWeight="bold" fontSize="20px">
        {name || 'AI Twin'}
      </Text>

      {/* Buttons for Threads and New Thread */}
      <HStack space="2">
        <IconButton
          icon={<Ionicons name="document-text" size={24} color="black" />}
          onPress={() => navigation.navigate('Threads', {knowledgebaseId})}
        />
        <IconButton
          isDisabled={isNewThreadDisabled}
          icon={<Ionicons name="add-circle" size={24} color="black" />}
          onPress={handleNewThread}
        />
      </HStack>
    </HStack>
  );
};

export default CustomHeader;
