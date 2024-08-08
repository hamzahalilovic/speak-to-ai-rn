import AsyncStorage from '@react-native-async-storage/async-storage';

const AI_TWINS_KEY = '/aiTwins';

// Function to get AI twins from AsyncStorage
export const getAITwins = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(AI_TWINS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to load AI twins', e);
    return [];
  }
};

// Function to save AI twins to AsyncStorage
export const saveAITwins = async aiTwins => {
  try {
    const jsonValue = JSON.stringify(aiTwins);
    await AsyncStorage.setItem(AI_TWINS_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save AI twins', e);
  }
};

// Function to add an AI twin to AsyncStorage
export const addAITwin = async newAITwin => {
  try {
    const existingAITwins = await getAITwins();
    const isDuplicate = existingAITwins.some(twin => twin.id === newAITwin.id);

    if (!isDuplicate) {
      const updatedAITwins = [...existingAITwins, newAITwin];
      await saveAITwins(updatedAITwins);
    }
  } catch (e) {
    console.error('Failed to add AI twin', e);
  }
};

// Function to remove an AI twin from AsyncStorage
export const removeAITwin = async aiTwinId => {
  try {
    const existingAITwins = await getAITwins();
    const updatedAITwins = existingAITwins.filter(twin => twin.id !== aiTwinId);
    await saveAITwins(updatedAITwins);
  } catch (e) {
    console.error('Failed to remove AI twin', e);
  }
};
