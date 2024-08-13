import React, {useState} from 'react';
import {View, FlatList, StyleSheet, TextInput, Alert} from 'react-native';
import {
  Text,
  Button,
  VStack,
  Box,
  Pressable,
} from '@gluestack-ui/themed-native-base';
import {useNavigation} from '@react-navigation/native';
import AITwinCard from './components/AITwinCard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useAppContext} from '../../context/AppContext';
import {saveDiscoveredAITwins} from '../discover/utils/aiTwinsStorage';

const DiscoverScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('preset');
  const {
    setSelectedAI,
    addAITwinToHome,
    removeAITwinFromHome,
    isAITwinAdded,
    aiTwinsPreset,
    aiTwinsDiscovered,
    setAiTwinsDiscovered,
  } = useAppContext();
  const navigation = useNavigation();

  const handleAddOrRemoveTwin = twin => {
    if (isAITwinAdded(twin.knowledgebaseId)) {
      removeAITwinFromHome(twin.knowledgebaseId);
    } else {
      addAITwinToHome(twin);
    }
  };

  const handleDeleteTwin = knowledgebaseId => {
    Alert.alert(
      'Delete AI Twin',
      'Are you sure you want to delete this AI Twin?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            const updatedTwins = aiTwinsDiscovered.filter(
              twin => twin.knowledgebaseId !== knowledgebaseId,
            );
            setAiTwinsDiscovered(updatedTwins);
            await saveDiscoveredAITwins(updatedTwins);
          },
          style: 'destructive',
        },
      ],
    );
  };

  const handleDeleteAllTwins = () => {
    Alert.alert(
      'Delete All AI Twins',
      'Are you sure you want to delete all discovered AI Twins? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete All',
          onPress: async () => {
            setAiTwinsDiscovered([]);
            await saveDiscoveredAITwins([]);
          },
          style: 'destructive',
        },
      ],
    );
  };

  console.log('aiTwinsPreset', aiTwinsPreset);
  console.log('aiTwinsDiscovered', aiTwinsDiscovered);

  return (
    <View style={styles.container}>
      <Text fontSize={24} fontWeight={600}  mb={4}>
        Discover AI’s
      </Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search AI's"
        placeholderTextColor="#aaa"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Custom Tab Navigation */}
      <View style={styles.tabContainer}>
        <Pressable
          onPress={() => setSelectedTab('preset')}
          style={[styles.tab, selectedTab === 'preset' && styles.activeTab]}>
          <Text style={styles.tabText}>Preset AI Twins</Text>
        </Pressable>
        <Pressable
          onPress={() => setSelectedTab('discovered')}
          style={[
            styles.tab,
            selectedTab === 'discovered' && styles.activeTab,
          ]}>
          <Text style={styles.tabText}>Discovered AI Twins</Text>
        </Pressable>
      </View>

      {/* Conditionally Render Content Based on Active Tab */}
      {selectedTab === 'preset' && (
        <FlatList
          data={aiTwinsPreset}
          keyExtractor={item => item.id}
          numColumns={2}
          renderItem={({item}) => (
            <VStack style={styles.cardWrapper}>
              <AITwinCard
                deletable={false}
                avatar={item.avatar}
                name={item.title}
                description={item.description}
                onChatPress={() => {
                  setSelectedAI(item);
                  navigation.navigate('Chat');
                }}
                onAddOrRemove={() => handleAddOrRemoveTwin(item)}
                isAdded={isAITwinAdded(item.knowledgebaseId)}
              />
            </VStack>
          )}
        />
      )}

      {selectedTab === 'discovered' && (
        <>
          <FlatList
            data={aiTwinsDiscovered}
            keyExtractor={item => item.knowledgebaseId}
            numColumns={2}
            renderItem={({item}) => (
              <VStack style={styles.cardWrapper}>
                <AITwinCard
                  deletable={true}
                  avatar={item.avatarUrl}
                  name={item.title}
                  description={item.description}
                  onChatPress={() => {
                    setSelectedAI(item);
                    navigation.navigate('Chat');
                  }}
                  onAddOrRemove={() => handleAddOrRemoveTwin(item)}
                  isAdded={isAITwinAdded(item.knowledgebaseId)}
                  onDelete={() => handleDeleteTwin(item.knowledgebaseId)}
                />
              </VStack>
            )}
          />
          {aiTwinsDiscovered.length > 0 && (
            <Button
              onPress={handleDeleteAllTwins}
              mt={4}
              colorScheme="red"
              variant="outline">
              Delete All Discovered AI Twins
            </Button>
          )}
        </>
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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  activeTab: {
    backgroundColor: '#6200ea',
  },
  tabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cardWrapper: {
    flex: 1,
    marginHorizontal: 6,
    marginBottom: 12,
    maxWidth: '48%',
  },
});

export default DiscoverScreen;
