import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, FlatList, StyleSheet, TextInput, Alert} from 'react-native';
import {
  Text,
  Button,
  ButtonText,
  VStack,
  Box,
  Pressable,
} from '@gluestack-ui/themed';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import AITwinCard from './components/AITwinCard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useAppContext} from '../../context/AppContext';
import {
  getDiscoveredAITwins,
  getPresetAITwins,
  saveDiscoveredAITwins,
} from '../discover/utils/aiTwinsStorage';

import HapticFeedback from 'react-native-haptic-feedback';

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
    setAiTwinsPreset,
  } = useAppContext();
  const navigation = useNavigation();

  const handleAddOrRemoveTwinHome = twin => {
    HapticFeedback.trigger('impactLight');
    if (isAITwinAdded(twin.knowledgebaseId)) {
      removeAITwinFromHome(twin.knowledgebaseId);
    } else {
      addAITwinToHome(twin);
    }
  };

  const handleDeleteTwinDiscovered = knowledgebaseId => {
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

  const handleDeleteAllTwinsDiscovered = () => {
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

  useFocusEffect(
    useCallback(() => {
      // This will run every time the DiscoverScreen is focused
      const updatePresetAITwins = async () => {
        // Assuming you're getting the updated preset twins
        const presetTwins = await getPresetAITwins();

        setAiTwinsPreset(presetTwins);
      };

      updatePresetAITwins();
    }, []),
  );

  const filteredPresetTwins = aiTwinsPreset.filter(twin =>
    twin.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredDiscoveredTwins = aiTwinsDiscovered.filter(twin =>
    twin.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <Text fontSize={24} fontWeight={600} mb={4}>
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
          <Text style={styles.tabText}>Preset</Text>
        </Pressable>
        <Pressable
          onPress={() => setSelectedTab('discovered')}
          style={[
            styles.tab,
            selectedTab === 'discovered' && styles.activeTab,
          ]}>
          <Text style={styles.tabText}>Discovered</Text>
        </Pressable>
      </View>

      {/* Conditionally Render Content Based on Active Tab */}
      {selectedTab === 'preset' && (
        <FlatList
          data={filteredPresetTwins}
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
                onAddOrRemove={() => handleAddOrRemoveTwinHome(item)}
                isAdded={isAITwinAdded(item.knowledgebaseId)}
              />
            </VStack>
          )}
        />
      )}

      {selectedTab === 'discovered' && (
        <>
          <FlatList
            data={filteredDiscoveredTwins}
            keyExtractor={item => item.knowledgebaseId}
            numColumns={2}
            renderItem={({item}) => (
              <VStack style={styles.cardWrapper}>
                <AITwinCard
                  deletable={true}
                  avatar={item.avatar}
                  name={item.title}
                  description={item.description}
                  onChatPress={() => {
                    setSelectedAI(item);
                    navigation.navigate('Chat');
                  }}
                  onAddOrRemove={() => handleAddOrRemoveTwinHome(item)}
                  isAdded={isAITwinAdded(item.knowledgebaseId)}
                  onDelete={() =>
                    handleDeleteTwinDiscovered(item.knowledgebaseId)
                  }
                />
              </VStack>
            )}
          />
          {aiTwinsDiscovered.length > 0 && (
            <Button
              onPress={handleDeleteAllTwinsDiscovered}
              mt={4}
              variant="link">
              <ButtonText color="red">
                Delete All Discovered AI Twins
              </ButtonText>
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
