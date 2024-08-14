import React, {useState, useEffect} from 'react';
import {View, FlatList, StyleSheet, Alert} from 'react-native';
import {
  Button,
  ButtonText,
  Text,
  Box,
  VStack,
  Spinner,
  Image,
  Modal,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  Center,
} from '@gluestack-ui/themed';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HTMLParser from 'react-native-html-parser';

import {useAppContext} from '../../context/AppContext';

const ScannerScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentAiTwin, setCurrentAiTwin] = useState(null);

  const [url, setUrl] = useState('');
  const [history, setHistory] = useState([]);
  const navigation = useNavigation();
  const {setAiTwinsDiscovered, aiTwinsDiscovered} = useAppContext();

  const fetchAITwinData = async url => {
    setIsLoading(true);
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'text/html',
        },
      });

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        const textData = await response.text();
        const parsed = new HTMLParser.DOMParser().parseFromString(
          textData,
          'text/html',
        );
        const scriptTag = parsed.getElementById('__NEXT_DATA__')?.textContent;
        if (scriptTag) {
          const aiTwinData = JSON.parse(scriptTag).props.pageProps;

          setIsLoading(false);
          setCurrentAiTwin(aiTwinData);
          setModalVisible(true);

          const isAlreadyAdded = aiTwinsDiscovered.some(
            twin => twin.knowledgebaseId === aiTwinData.knowledgebaseId,
          );

          if (!isAlreadyAdded) {
            setAiTwinsDiscovered([...aiTwinsDiscovered, aiTwinData]);
            await AsyncStorage.setItem(
              'discoveredAITwins',
              JSON.stringify([...aiTwinsDiscovered, aiTwinData]),
            );
          }

          if (!history.includes(url)) {
            const updatedHistory = [...history, url];
            setHistory(updatedHistory);
            await AsyncStorage.setItem(
              'scanHistory',
              JSON.stringify(updatedHistory),
            );
          }
        } else {
          setIsLoading(false);
          Alert.alert('Invalid URL', 'No AI Twin found for the entered URL.');
        }
      } else {
        setIsLoading(false);
        Alert.alert('Invalid URL', 'No AI Twin found for the entered URL.');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Failed to fetch AI twin data:', error);
      Alert.alert('Error', 'Failed to fetch AI Twin data.');
    }
  };

  useEffect(() => {
    // Load history and discovered AI twins from async storage
    const loadInitialData = async () => {
      const storedHistory = await AsyncStorage.getItem('scanHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }

      const storedDiscovered = await AsyncStorage.getItem('discoveredAITwins');
      if (storedDiscovered) {
        setAiTwinsDiscovered(JSON.parse(storedDiscovered));
      }
    };
    loadInitialData();
  }, []);

  const handleFetchFromUrl = () => {
    // Show the alert with a text input to enter the URL
    Alert.prompt(
      'Enter URL',
      'Please enter the URL of the AI Twin you want to fetch:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Fetch',
          onPress: async inputUrl => {
            if (inputUrl) {
              const isValidDomain =
                /^https:\/\/hey\.speak-to\.ai(\/[a-zA-Z0-9-]*)?$/.test(
                  inputUrl,
                );
              if (isValidDomain) {
                setIsLoading(true);
                await fetchAITwinData(inputUrl);
              } else {
                Alert.alert(
                  'Invalid URL',
                  'No AI Twin found for the entered URL.',
                );
              }
            }
          },
        },
      ],
      'plain-text',
    );
  };

  const handleFetchFromHistory = async url => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'text/html',
        },
      });

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        const textData = await response.text();
        const parsed = new HTMLParser.DOMParser().parseFromString(
          textData,
          'text/html',
        );
        const scriptTag = parsed.getElementById('__NEXT_DATA__')?.textContent;

        if (scriptTag) {
          const aiTwinData = JSON.parse(scriptTag).props.pageProps;
          const isAlreadyAdded = aiTwinsDiscovered.some(
            twin => twin.knowledgebaseId === aiTwinData.knowledgebaseId,
          );

          if (!isAlreadyAdded) {
            Alert.alert(
              'AI Twin Found',
              `${aiTwinData.name} has been found.`,
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Add to Discover',
                  onPress: async () => {
                    setAiTwinsDiscovered([...aiTwinsDiscovered, aiTwinData]);
                    await AsyncStorage.setItem(
                      'discoveredAITwins',
                      JSON.stringify([...aiTwinsDiscovered, aiTwinData]),
                    );
                  },
                },
              ],
              {cancelable: true},
            );
          } else {
            Alert.alert(
              'AI Twin Found',
              'This AI Twin is already in Discover.',
            );
          }

          return isAlreadyAdded;
        }
      }
    } catch (error) {
      console.error('Failed to fetch AI twin data:', error);
    }
  };

  const handleClearHistory = async () => {
    await AsyncStorage.removeItem('scanHistory');
    setHistory([]);
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <Center mt={4}>
          <Spinner size={24} color="emerald.500" />
          <Text>Loading...</Text>
        </Center>
      )}
      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            <Text>AI Twin Found</Text>
          </ModalHeader>
          <ModalBody>
            {currentAiTwin && (
              <VStack space={4} alignItems="center">
                <Image
                  source={{uri: currentAiTwin.avatar}}
                  alt="AI Twin Avatar"
                  size="xl"
                  borderRadius={100}
                />
                <Text fontWeight="bold" mt={2}>
                  {currentAiTwin.title}
                </Text>
                {aiTwinsDiscovered.some(
                  twin =>
                    twin.knowledgebaseId === currentAiTwin.knowledgebaseId,
                ) ? (
                  <Text color="green.500" mt={2}>
                    AI Twin added to Discover
                  </Text>
                ) : (
                  <Button
                    mt={2}
                    onPress={() => handleAddToDiscover(currentAiTwin)}>
                    <ButtonText>Add to Discover</ButtonText>
                  </Button>
                )}
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      <Text fontSize={24} fontWeight={600} mb={4}>
        AI Twin Scanner
      </Text>
      <Button
        bg="#2D313B"
        onPress={() => navigation.navigate('QRCodeScanner')}
        mb={4}>
        <ButtonText>Scan QR Code</ButtonText>
      </Button>
      <Button bg="#2D313B" onPress={handleFetchFromUrl} mb={4}>
        <ButtonText>Enter URL</ButtonText>
      </Button>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}>
        <Text fontSize={20} fontWeight={600}>
          Scan History
        </Text>
        <Text onPress={handleClearHistory} color="red">
          Clear Scan History
        </Text>
      </Box>

      <FlatList
        data={history}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => {
          const isAlreadyAdded = aiTwinsDiscovered.some(
            twin => twin.knowledgebaseId === item.knowledgebaseId,
          );

          return (
            <Box
              mb={2}
              p={2}
              borderWidth={1}
              borderColor="gray.300"
              borderRadius="md">
              <Text>{item}</Text>
              {isAlreadyAdded ? (
                <Text color="green.500" mt={2} alignSelf="center">
                  AI Twin already added
                </Text>
              ) : (
                <Button
                  bg="#2D313B"
                  mt={2}
                  size="sm"
                  onPress={() => handleFetchFromHistory(item)}>
                  <ButtonText>Add to Discover</ButtonText>
                </Button>
              )}
            </Box>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: 55,
  },
});

export default ScannerScreen;
