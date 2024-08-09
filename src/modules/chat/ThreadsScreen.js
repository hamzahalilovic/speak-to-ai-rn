import React, {useEffect, useState} from 'react';
import {View, FlatList, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  Button,
  HStack,
  Text,
  Box,
  Menu,
  Pressable,
  Icon,
  Popover,
} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  getThreads,
  deleteAllThreads,
  deleteThread,
  saveThreads,
} from './utils/threadsStorage';
import {useAppContext} from '../../context/AppContext';

const ThreadsScreen = ({route}) => {
  const {selectedAI, setCurrentThreadId, threads, setThreads} = useAppContext();

  const knowledgebaseId = selectedAI.knowledgebaseId;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchThreads = async () => {
      const loadedThreads = await getThreads(knowledgebaseId);
      setThreads(loadedThreads);
    };

    fetchThreads();
  }, [knowledgebaseId]);

  const handleThreadPress = thread => {
    setCurrentThreadId(thread.id);
    navigation.navigate('Chat');
  };

  const handleDeleteThread = threadId => {
    Alert.alert(
      'Delete Thread',
      'Are you sure you want to delete this thread?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteThread(knowledgebaseId, threadId);
            const updatedThreads = threads.filter(
              thread => thread.id !== threadId,
            );
            setThreads(updatedThreads);
          },
        },
      ],
      {cancelable: true},
    );
  };

  const handleDeleteAllThreads = () => {
    Alert.alert(
      'Delete All Threads',
      'Are you sure you want to delete all threads? This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            await deleteAllThreads(knowledgebaseId);
            setThreads([]);
          },
        },
      ],
      {cancelable: true},
    );
  };

  const handleShowThreadInfo = thread => {
    Alert.alert('Thread Information', `Created on: ${thread.createdAt}`);
  };

  const renameThread = async threadId => {
    const thread = threads.find(t => t.id === threadId);

    if (!thread) {
      Alert.alert(
        'Thread Not Found',
        'The thread you are trying to rename does not exist.',
      );
      return;
    }

    Alert.prompt(
      'Rename Thread',
      'Enter a new name for this thread:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async newTitle => {
            if (newTitle) {
              try {
                const updatedThreads = threads.map(t =>
                  t.id === threadId ? {...t, title: newTitle} : t,
                );
                setThreads(updatedThreads);
                await saveThreads(knowledgebaseId, updatedThreads);
                Alert.alert('Success', 'Thread renamed successfully!');
              } catch (e) {
                console.error('Failed to rename thread', e);
                Alert.alert(
                  'Error',
                  'An error occurred while renaming the thread.',
                );
              }
            }
          },
        },
      ],
      'plain-text',
      thread.title,
    );
  };

  console.log('threads in threads screen', threads);

  return (
    <View style={{flex: 1, padding: 16, marginTop: 50}}>
      <FlatList
        data={threads}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <HStack
            justifyContent="space-between"
            alignItems="center"
            padding={4}
            borderBottomWidth={1}
            borderBottomColor="gray.200">
            <Pressable onPress={() => handleThreadPress(item)} flex={1}>
              <Text>{item.title}</Text>
            </Pressable>
            <Menu
              w="190"
              trigger={triggerProps => {
                return (
                  <Pressable {...triggerProps}>
                    <Icon as={Ionicons} name="ellipsis-vertical" size="lg" />
                  </Pressable>
                );
              }}>
              <Menu.Item onPress={() => renameThread(item.id)}>
                <HStack alignItems="center">
                  <Icon as={Ionicons} name="pencil" size="sm" mr={2} />
                  <Text>Edit</Text>
                </HStack>
              </Menu.Item>
              <Menu.Item onPress={() => handleShowThreadInfo(item)}>
                <HStack alignItems="center">
                  <Icon
                    as={Ionicons}
                    name="information-circle"
                    size="sm"
                    mr={2}
                  />
                  <Text>Info</Text>
                </HStack>
              </Menu.Item>
              <Menu.Item onPress={() => handleDeleteThread(item.id)}>
                <HStack alignItems="center">
                  <Icon
                    as={Ionicons}
                    name="trash"
                    size="sm"
                    color="red.500"
                    mr={2}
                  />
                  <Text color="red.500">Delete</Text>
                </HStack>
              </Menu.Item>
            </Menu>
          </HStack>
        )}
      />

      <Button
        mt={4}
        borderColor="red.500"
        variant="outline"
        colorScheme="red"
        onPress={handleDeleteAllThreads}>
        Delete All Threads
      </Button>
    </View>
  );
};

export default ThreadsScreen;
