import AsyncStorage from '@react-native-async-storage/async-storage';

const THREADS_KEY = knowledgebaseId => `/threads/${knowledgebaseId}`;

export const getThreads = async knowledgebaseId => {
  try {
    const jsonValue = await AsyncStorage.getItem(THREADS_KEY(knowledgebaseId));
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to load threads', e);
    return [];
  }
};

export const saveThreads = async (knowledgebaseId, threads) => {
  try {
    const jsonValue = JSON.stringify(threads);
    await AsyncStorage.setItem(THREADS_KEY(knowledgebaseId), jsonValue);
  } catch (e) {
    console.error('Failed to save threads', e);
  }
};

export const saveThread = async (knowledgebaseId, newThread) => {
  if (!newThread || !newThread.id || newThread.messages.length === 0) return; // Ensure no empty threads are saved

  try {
    const existingThreads = await getThreads(knowledgebaseId);
    const isDuplicate = existingThreads.some(
      thread => thread.id === newThread.id,
    );

    if (!isDuplicate) {
      const updatedThreads = [...existingThreads, newThread];
      await saveThreads(knowledgebaseId, updatedThreads);
    }
  } catch (e) {
    console.error('Failed to save thread', e);
  }
};

export const deleteThread = async (knowledgebaseId, threadId) => {
  try {
    const existingThreads = await getThreads(knowledgebaseId);
    const updatedThreads = existingThreads.filter(
      thread => thread.id !== threadId,
    );
    await saveThreads(knowledgebaseId, updatedThreads);
  } catch (e) {
    console.error('Failed to delete thread', e);
  }
};

export const deleteAllThreads = async knowledgebaseId => {
  try {
    await saveThreads(knowledgebaseId, []);
  } catch (e) {
    console.error('Failed to delete all threads', e);
  }
};
