import React, {useState} from 'react';
import {View, FlatList, StyleSheet, TextInput} from 'react-native';
import {Text, Button, Icon} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import AITwinCard from './components/AITwinCard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useAppContext} from '../../context/AppContext';

const DiscoverScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const {setSelectedAI, addAITwinToHome, removeAITwinFromHome, isAITwinAdded} =
    useAppContext();
  const navigation = useNavigation();

  // Mocked data for AI Twins
  const aiTwins = [
    {
      id: 'markus',
      name: 'Markus AI',
      description: 'About Markus AI',
      avatar:
        'https://s3.us-east-1.amazonaws.com/cdn.speak-to.ai/avatars/markus.png',
      knowledgebaseId: '90c6c52a-007c-4d71-a422-3a5d4dd1e4df',
    },
    {
      id: 'valto',
      name: 'Valto AI',
      description: 'About Valto AI',
      avatar:
        'https://s3.us-east-1.amazonaws.com/cdn.speak-to.ai/avatars/valto.png',
      knowledgebaseId: '0e4f5d01-3b31-4081-a91c-eb861ff2a595',
    },
    {
      id: 'jouko',
      name: 'Jouko AI',
      description: 'About Jouko AI',
      avatar:
        'https://s3.us-east-1.amazonaws.com/cdn.speak-to.ai/avatars/jouko.png',
      knowledgebaseId: '7fdbc604-8eb4-43a1-82bd-4eafb60640ee',
    },
    {
      id: 'johanna',
      name: 'Johanna AI',
      description: 'About Johanna AI',
      avatar:
        'https://s3.us-east-1.amazonaws.com/cdn.speak-to.ai/avatars/johanna.png',
      knowledgebaseId: 'a412bc57-4aa4-4769-8915-d6a63eece050',
    },
  ];

  // Filtered AI Twins based on search query
  // const filteredTwins = aiTwins.filter(twin =>
  //   twin.name.toLowerCase().includes(searchQuery.toLowerCase()),
  // );

  const handleAddOrRemoveTwin = twin => {
    if (isAITwinAdded(twin.knowledgebaseId)) {
      removeAITwinFromHome(twin.knowledgebaseId);
    } else {
      addAITwinToHome(twin);
    }
  };

  return (
    <View style={styles.container}>
      <Text fontSize={24} fontWeight={600} lineHeight={33}>
        Discover AI’s
      </Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search AI's"
        placeholderTextColor="#aaa"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        style={{marginTop: 46}}
        data={aiTwins}
        keyExtractor={item => item.id}
        numColumns={2}
        renderItem={({item}) => (
          <View style={styles.cardWrapper}>
            <AITwinCard
              avatar={item.avatar}
              name={item.name}
              description={item.description}
              onChatPress={() => {
                setSelectedAI(item);
                navigation.navigate('Chat');
              }}
              onAddOrRemove={() => handleAddOrRemoveTwin(item)}
              isAdded={isAITwinAdded(item.knowledgebaseId)}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    paddingHorizontal: 35,
    height: '100%',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    marginBottom: 16,
    marginTop: 26,
  },
  cardWrapper: {
    flex: 1,
    marginHorizontal: 6,
    marginBottom: 12,
    maxWidth: '48%',
  },
});

export default DiscoverScreen;
