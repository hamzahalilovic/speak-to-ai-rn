import React, {useState} from 'react';
import {View, FlatList, StyleSheet, TextInput} from 'react-native';

import {Text} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import AITwinCard from './components/AITwinCard';

import {useAppContext} from '../../context/AppContext';

const DiscoverScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const {setSelectedAI} = useAppContext();
  const navigation = useNavigation();

  // Mocked data for AI Twins
  const aiTwins = [
    {id: 'markus', name: 'AI Twin Markus', description: 'About Markus AI'},
    {id: 'jouko', name: 'AI Twin Jouko', description: 'About Jouko AI'},
    {id: 'valto', name: 'AI Twin Valto', description: 'About Valto AI'},
    {id: 'valto', name: 'AI Twin Valto', description: 'About Valto AI'},
    // Add more AI twins as needed
  ];

  // Filtered AI Twins based on search query
  const filteredTwins = aiTwins.filter(twin =>
    twin.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
        data={filteredTwins}
        keyExtractor={item => item.id}
        numColumns={2}
        renderItem={({item}) => (
          <View style={styles.cardWrapper}>
            <AITwinCard
              name={item.name}
              description={item.description}
              onChatPress={() => {
                setSelectedAI(item);
                navigation.navigate('Chat');
              }}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    paddingHorizontal: 35,
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
  grid: {
    justifyContent: 'center',
  },
  row: {
    justifyContent: 'space-between',
  },
  cardWrapper: {
    flex: 1,
    marginHorizontal: 6, // 12px total gap (6px each side)
    marginBottom: 12,
    maxWidth: '48%', // Ensures 2 columns fit within the screen
  },
});

export default DiscoverScreen;
