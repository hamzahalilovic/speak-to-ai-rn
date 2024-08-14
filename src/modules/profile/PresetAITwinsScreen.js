import React, {useEffect, useState} from 'react';
import {
  Box,
  Text,
  Image,
  Pressable,
  VStack,
  Center,
  ScrollView,
} from '@gluestack-ui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HapticFeedback from 'react-native-haptic-feedback';

const AI_TWINS_PRESET_KEY = '/aiTwins/preset';
import {aiTwins} from './data/aiTwinsPreset';

const PresetAITwinsScreen = () => {
  const [presetTwins, setPresetTwins] = useState([]);

  useEffect(() => {
    const loadPresetTwins = async () => {
      const jsonValue = await AsyncStorage.getItem(AI_TWINS_PRESET_KEY);
      setPresetTwins(jsonValue != null ? JSON.parse(jsonValue) : []);
    };

    loadPresetTwins();
  }, []);

  const toggleTwin = async twin => {
    // Trigger haptic feedback when a twin is pressed
    HapticFeedback.trigger('selection');

    let updatedTwins;
    if (presetTwins.some(item => item.userId === twin.userId)) {
      updatedTwins = presetTwins.filter(item => item.userId !== twin.userId);
    } else {
      updatedTwins = [...presetTwins, twin];
    }
    setPresetTwins(updatedTwins);
    await AsyncStorage.setItem(
      AI_TWINS_PRESET_KEY,
      JSON.stringify(updatedTwins),
    );
  };

  const isTwinPreset = twin =>
    presetTwins.some(item => item.userId === twin.userId);

  console.log('presetTwins presetaitwins screen', presetTwins);

  return (
    <ScrollView backgroundColor="#fff">
      <Center flex={1} px="3" backgroundColor="#fff" mt={30} mb={30}>
        <VStack space="xl" alignItems="center">
          {aiTwins.map(twin => (
            <Pressable
              key={twin.knowledgebaseId}
              onPress={() => toggleTwin(twin)}>
              <Box
                width={250}
                borderRadius={12}
                borderWidth={2}
                borderColor={isTwinPreset(twin) ? 'lightgreen' : 'lightgray'}
                p={4}
                alignItems="center"
                backgroundColor="white">
                <Image
                  source={{uri: twin.avatar}}
                  alt={`${twin.name} avatar`}
                  size="lg"
                  borderRadius="full"
                  mb={2}
                />
                <Text bold>{twin.title}</Text>

                <Text fontSize={14} color="#666" mb="12px" textAlign="center">
                  {twin.description.length > 200
                    ? `${twin.description.substring(0, 200)}...`
                    : twin.description}
                </Text>
                {isTwinPreset(twin) && (
                  <Text color="lightgreen" mt={2}>
                    ✓ Added
                  </Text>
                )}
              </Box>
            </Pressable>
          ))}
        </VStack>
      </Center>
    </ScrollView>
  );
};

export default PresetAITwinsScreen;
