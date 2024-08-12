import React, {useEffect, useState} from 'react';
import {
  Box,
  Text,
  Image,
  Pressable,
  VStack,
  Center,
  ScrollView,
} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AI_TWINS_PRESET_KEY = '/aiTwins/preset';

const PresetAITwinsScreen = () => {
  const aiTwins = [
    {
      id: 'markus',
      name: 'Markus AI',
      description: 'About Markus AI',
      avatar:
        'https://s3.us-east-1.amazonaws.com/cdn.speak-to.ai/avatars/markus.png',
      knowledgebaseId: '90c6c52a-007c-4d71-a422-3a5d4dd1e4df',
    },
    {
      id: 'valto',
      name: 'Valto AI',
      description: 'About Valto AI',
      avatar:
        'https://s3.us-east-1.amazonaws.com/cdn.speak-to.ai/avatars/valto.png',
      knowledgebaseId: '0e4f5d01-3b31-4081-a91c-eb861ff2a595',
    },
    {
      id: 'jouko',
      name: 'Jouko AI',
      description: 'About Jouko AI',
      avatar:
        'https://s3.us-east-1.amazonaws.com/cdn.speak-to.ai/avatars/jouko.png',
      knowledgebaseId: '7fdbc604-8eb4-43a1-82bd-4eafb60640ee',
    },
    {
      id: 'johanna',
      name: 'Johanna AI',
      description: 'About Johanna AI',
      avatar:
        'https://s3.us-east-1.amazonaws.com/cdn.speak-to.ai/avatars/johanna.png',
      knowledgebaseId: 'a412bc57-4aa4-4769-8915-d6a63eece050',
    },
  ];

  const [presetTwins, setPresetTwins] = useState([]);

  useEffect(() => {
    const loadPresetTwins = async () => {
      const jsonValue = await AsyncStorage.getItem(AI_TWINS_PRESET_KEY);
      setPresetTwins(jsonValue != null ? JSON.parse(jsonValue) : []);
    };

    loadPresetTwins();
  }, []);

  const toggleTwin = async twin => {
    let updatedTwins;
    if (presetTwins.some(item => item.id === twin.id)) {
      updatedTwins = presetTwins.filter(item => item.id !== twin.id);
    } else {
      updatedTwins = [...presetTwins, twin];
    }
    setPresetTwins(updatedTwins);
    await AsyncStorage.setItem(
      AI_TWINS_PRESET_KEY,
      JSON.stringify(updatedTwins),
    );
  };

  const isTwinPreset = twin => presetTwins.some(item => item.id === twin.id);

  console.log('presetTwins presetaitwins screen', presetTwins);

  return (
    <ScrollView backgroundColor="#fff">
      <Center flex={1} px="3" backgroundColor="#fff">
        <Text fontSize="xl" bold alignSelf={'flex-start'} mb={15} mt={15}>
          Select Preset AI Twins
        </Text>
        <VStack space={4} alignItems="center">
          {aiTwins.map(twin => (
            <Pressable key={twin.id} onPress={() => toggleTwin(twin)}>
              <Box
                width={250}
                borderRadius="lg"
                borderWidth={2}
                borderColor={isTwinPreset(twin) ? 'green.500' : 'coolGray.200'}
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
                <Text fontSize="lg" bold>
                  {twin.name}
                </Text>
                <Text fontSize="md" color="coolGray.600">
                  {twin.description}
                </Text>
                {isTwinPreset(twin) && (
                  <Text color="green.500" mt={2}>
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
