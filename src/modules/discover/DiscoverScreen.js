import React, {useState} from 'react';
import {View, FlatList, StyleSheet, TextInput} from 'react-native';
import {Text, Button, Icon, VStack, Box, Pressable} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import AITwinCard from './components/AITwinCard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useAppContext} from '../../context/AppContext';

const DiscoverScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const {
    setSelectedAI,
    addAITwinToHome,
    removeAITwinFromHome,
    isAITwinAdded,
    aiTwinsPreset,
    aiTwinsDiscovered,
  } = useAppContext();
  const navigation = useNavigation();

  const handleAddOrRemoveTwin = twin => {
    if (isAITwinAdded(twin.knowledgebaseId)) {
      removeAITwinFromHome(twin.knowledgebaseId);
    } else {
      addAITwinToHome(twin);
    }
  };
  console.log('aiTwinsPreset discover screen', aiTwinsPreset);
  const [showPreset, setShowPreset] = useState(true);
  const [showDiscovered, setShowDiscovered] = useState(false);

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

      {/* Preset AI Twins */}
      <Pressable onPress={() => setShowPreset(!showPreset)}>
        <Box
          backgroundColor="gray.200"
          borderRadius="md"
          p={2}
          mb={2}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center">
          <Text fontSize="md" fontWeight="bold">
            Preset AI Twins
          </Text>
          <Icon
            as={Ionicons}
            name={showPreset ? 'chevron-up' : 'chevron-down'}
            size="sm"
          />
        </Box>
      </Pressable>
      {showPreset && (
        <FlatList
          data={aiTwinsPreset}
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
      )}

      {/* Discovered AI Twins */}
      <Pressable onPress={() => setShowDiscovered(!showDiscovered)}>
        <Box
          backgroundColor="gray.200"
          borderRadius="md"
          p={2}
          mb={2}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center">
          <Text fontSize="md" fontWeight="bold">
            Discovered AI Twins
          </Text>
          <Icon
            as={Ionicons}
            name={showDiscovered ? 'chevron-up' : 'chevron-down'}
            size="sm"
          />
        </Box>
      </Pressable>
      {showDiscovered && (
        <FlatList
          data={discoveredAITwins} // Currently empty, but add data here later
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    height: '100%',
    paddingTop: 55,
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
