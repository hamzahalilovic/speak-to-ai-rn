import AsyncStorage from '@react-native-async-storage/async-storage';

const AI_TWINS_KEY = '/aiTwins';

const AI_TWINS_DISCOVERED_KEY = '/aiTwins/discovered';

const AI_TWINS_PRESET_KEY = '/aiTwins/preset';

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

// Function to get discovered AI twins from AsyncStorage
export const getDiscoveredAITwins = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(AI_TWINS_DISCOVERED_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to load discovered AI twins', e);
    return [];
  }
};

// Function to save discovered AI twins to AsyncStorage
export const saveDiscoveredAITwins = async aiTwins => {
  try {
    const jsonValue = JSON.stringify(aiTwins);
    await AsyncStorage.setItem(AI_TWINS_DISCOVERED_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save discovered AI twins', e);
  }
};

// Function to get preset AI twins from AsyncStorage
export const getPresetAITwins = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(AI_TWINS_PRESET_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to load preset AI twins', e);
    return [];
  }
};

// Function to save preset AI twins to AsyncStorage
export const savePresetAITwins = async aiTwins => {
  try {
    const jsonValue = JSON.stringify(aiTwins);
    await AsyncStorage.setItem(AI_TWINS_PRESET_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save preset AI twins', e);
  }
};
