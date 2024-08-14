import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import {
  Button,
  ButtonText,
  Text,
  Box,
  VStack,
  Spinner,
  FlatList,
  Image,
  Modal,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  Center,
  Badge,
  HStack,
  BadgeText,
  AvatarImage,
  Avatar,
  Divider,
  ModalBackdrop,
  ButtonIcon,
  Pressable,
} from '@gluestack-ui/themed';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HTMLParser from 'react-native-html-parser';

import {useAppContext} from '../../context/AppContext';

import Ionicons from 'react-native-vector-icons/Ionicons';

import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ScannerScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentAiTwin, setCurrentAiTwin] = useState(null);

  const [url, setUrl] = useState('');
  const [history, setHistory] = useState([]);

  const navigation = useNavigation();
  const {setAiTwinsDiscovered, aiTwinsDiscovered} = useAppContext();

  const fetchAITwinData = async inputUrl => {
    setIsLoading(true);
    try {
      const response = await fetch(inputUrl, {
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

          const updatedHistory = [...history, {url: inputUrl, aiTwinData}];
          setHistory(updatedHistory);
          await AsyncStorage.setItem(
            'scanHistory',
            JSON.stringify(updatedHistory),
          );
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
  console.log('history', history);
  return (
    <View style={styles.container}>
      <VStack space="md">
        {isLoading && (
          <Center mt={4}>
            <Spinner size={24} color="emerald" />
            <Text>Loading...</Text>
          </Center>
        )}
        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <ModalBackdrop />

          <ModalContent>
            <ModalCloseButton>
              <Text fontWeight={'bold'} fontSize={14}>
                X
              </Text>
            </ModalCloseButton>
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
                    <Text color="green" mt={2}>
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
        <Text fontSize={16} fontWeight={400} mb={4}>
          Enter the URL manually or scan the QR code of your AI Twin
        </Text>
        {/* <Button
          bg="#2D313B"
          onPress={() => navigation.navigate('QRCodeScanner')}
          mb={4}>
          <ButtonText>Scan QR Code</ButtonText>
        </Button>
        <Button bg="#2D313B" onPress={handleFetchFromUrl} mb={4}>
          <ButtonText>Enter URL</ButtonText>
        </Button> */}

        <HStack
          width="100%"
          space="2xl"
          paddingHorizontal={60}
          alignContent="center"
          justifyContent="space-between">
          <TouchableOpacity onPress={handleFetchFromUrl}>
            <Feather name="link-2" size={75} color="#2D313B" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('QRCodeScanner')}>
            <MaterialCommunityIcons
              name="qrcode-scan"
              size={75}
              color="#2D313B"
            />
          </TouchableOpacity>
        </HStack>

        <Divider mt={20} mb={20} />
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

        {history.length > 0 ? (
          <FlatList
            data={history}
            h="100%"
            keyExtractor={(item, index) => index.toString()}
            extraData={aiTwinsDiscovered} // Ensure the FlatList re-renders when this changes
            renderItem={({item}) => {
              if (!item.aiTwinData) return null;
              const isAlreadyAdded = aiTwinsDiscovered.some(
                twin =>
                  twin.knowledgebaseId === item.aiTwinData.knowledgebaseId,
              );

              return (
                <Box
                  mb={4}
                  p={4}
                  bg="#fff"
                  borderWidth={1}
                  borderColor="#e0e0e0"
                  borderRadius={12}
                  padding={12}
                  shadow={2}>
                  <HStack alignItems="center" space="sm">
                    <Ionicons name="link-outline" size={20} color="#2D313B" />
                    <Avatar size="sm" bg="transparent">
                      <AvatarImage source={{uri: item.aiTwinData.avatar}} />
                    </Avatar>
                    <VStack flex={1}>
                      <Text fontWeight="bold" fontSize="lg" color="#2D313B">
                        {item.aiTwinData.title}
                      </Text>
                      <Text fontSize="sm" color="#666">
                        {item.url}
                      </Text>
                    </VStack>
                  </HStack>
                  {isAlreadyAdded ? (
                    <Badge alignSelf="center" bg="lightgreen" size="md" mt={10}>
                      <BadgeText fontSize={12} color="green">
                        Added
                      </BadgeText>
                    </Badge>
                  ) : (
                    <Button
                      bg="#4CAF50"
                      size="xs"
                      onPress={() => handleFetchFromHistory(item.url)}>
                      <ButtonText fontSize={8} color="#fff">
                        Add
                      </ButtonText>
                    </Button>
                  )}
                </Box>
              );
            }}
          />
        ) : (
          <Text>No scan history found</Text>
        )}
      </VStack>
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
