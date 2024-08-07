import React, {useEffect, useState} from 'react';
import {View, FlatList, Text, TouchableOpacity, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  getThreads,
  deleteAllThreads,
  deleteThread,
} from './utils/threadsStorage';
import {useAppContext} from '../../context/AppContext';
import {Button} from 'native-base';

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
    setCurrentThreadId(thread.id); // Set the currentThreadId in the context
    navigation.navigate('Chat'); // Navigate to the Chat screen
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

  console.log('threads in threads screen', threads);

  return (
    <View>
      <Button
        title="Delete All Threads"
        color="red"
        onPress={handleDeleteAllThreads}
        _text={'delete all threads'}
      />

      <FlatList
        data={threads}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 10,
            }}>
            <TouchableOpacity
              onPress={() => handleThreadPress(item)}
              style={{flex: 1}}>
              <Text>{item.title}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteThread(item.id)}>
              <Text style={{color: 'red'}}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default ThreadsScreen;
