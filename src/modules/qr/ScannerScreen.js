import React, {useState, useEffect} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {
  Button,
  Text,
  Box,
  VStack,
  Input,
} from '@gluestack-ui/themed-native-base';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HTMLParser from 'react-native-html-parser';

import {useAppContext} from '../../context/AppContext';

const ScannerScreen = () => {
  const [url, setUrl] = useState('');
  const [history, setHistory] = useState([]);
  const navigation = useNavigation();
  const {setAiTwinsDiscovered, aiTwinsDiscovered} = useAppContext();

  const fetchAITwinData = async url => {
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
          console.log('aitwindata scanner', aiTwinData);

          setAiTwinsDiscovered([...aiTwinsDiscovered, aiTwinData]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch AI twin data:', error);
    }
  };

  useEffect(() => {
    // Load history from async storage
    const loadHistory = async () => {
      const storedHistory = await AsyncStorage.getItem('scanHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    };
    loadHistory();
  }, []);

  const handleFetchFromUrl = async () => {
    if (url) {
      await fetchAITwinData(url);
      if (!history.includes(url)) {
        const updatedHistory = [...history, url];
        setHistory(updatedHistory);
        await AsyncStorage.setItem(
          'scanHistory',
          JSON.stringify(updatedHistory),
        );
      }
      setUrl('');
    }
  };

  const handleFetchFromHistory = async url => {
    await fetchAITwinData(url);
  };

  const handleClearHistory = async () => {
    await AsyncStorage.removeItem('scanHistory');
    setHistory([]);
  };

  return (
    <View style={styles.container}>
      <Text fontSize={24} fontWeight={600} mb={4}>
        AI Twin Scanner
      </Text>
      <Button onPress={() => navigation.navigate('QRCodeScanner')} mb={4}>
        Scan QR Code
      </Button>
      <VStack space={4} alignItems="center" mb={8}>
        <Input
          placeholder="Enter URL"
          value={url}
          onChangeText={setUrl}
          width="100%"
          mb={2}
        />
        <Button onPress={handleFetchFromUrl}>Fetch Data</Button>
      </VStack>
      <Button onPress={handleClearHistory} colorScheme="danger" mb={4}>
        Clear Scan History
      </Button>
      <Text fontSize={20} fontWeight={600} mb={2}>
        Scan History
      </Text>
      <FlatList
        data={history}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <Box
            mb={2}
            p={2}
            borderWidth={1}
            borderColor="gray.300"
            borderRadius="md">
            <Text>{item}</Text>
            <Button
              mt={2}
              size="sm"
              onPress={() => handleFetchFromHistory(item)}>
              Fetch Again
            </Button>
          </Box>
        )}
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
