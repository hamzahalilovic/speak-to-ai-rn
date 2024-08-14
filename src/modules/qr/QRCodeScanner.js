import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import DeviceInfo from 'react-native-device-info';
import HTMLParser from 'react-native-html-parser';
import {
  Spinner,
  VStack,
  Image,
  Box,
  Button,
  ButtonText,
  ButtonGroup,
  Text,
  View,
} from '@gluestack-ui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppContext} from '../../context/AppContext';
import Icon from 'react-native-vector-icons/Ionicons';

const QRCodeScanner = () => {
  const useGetCameraDevice = DeviceInfo.isEmulatorSync()
    ? () => undefined
    : useCameraDevice;

  const device = useGetCameraDevice('back');
  const {hasPermission, requestPermission} = useCameraPermission();
  const [qrCodeData, setQrCodeData] = useState(null);
  const [aiTwinName, setAiTwinName] = useState(null);
  const [isValidDomain, setIsValidDomain] = useState(false);
  const [aiTwinData, setAiTwinData] = useState(null);
  const [fetchError, setFetchError] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [loading, setLoading] = useState(false);

  const {aiTwinsDiscovered, setAiTwinsDiscovered, addDiscoveredAITwin} =
    useAppContext();

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const saveScanToHistory = async (url, aiTwinData) => {
    try {
      const storedHistory = await AsyncStorage.getItem('scanHistory');
      const history = storedHistory ? JSON.parse(storedHistory) : [];

      // Check if the item already exists in the history
      const isDuplicate = history.some(item => item.url === url);

      if (!isDuplicate) {
        const updatedHistory = [...history, {url, aiTwinData}];
        await AsyncStorage.setItem(
          'scanHistory',
          JSON.stringify(updatedHistory),
        );
      }
    } catch (error) {
      console.error('Failed to save scan history:', error);
    }
  };

  const fetchAITwinData = async name => {
    setLoading(true);
    const API_URL = 'https://hey.speak-to.ai/';
    try {
      const response = await fetch(`${API_URL}${name}`, {
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

          setAiTwinData(aiTwinData);
          setFetchError(false);
          saveScanToHistory(`${API_URL}${name}`, aiTwinData); // Pass both URL and AI Twin Data here
        } else {
          setFetchError(true);
        }
      } else {
        setFetchError(true);
      }
    } catch (error) {
      setFetchError(true);
      console.error('Failed to fetch AI twin data:', error);
    } finally {
      setLoading(false);
      setIsScanning(false);
    }
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      if (isScanning) {
        codes.forEach(code => {
          const url = code.value;
          console.log('QR Code detected:', url);

          const domainPattern =
            /^https:\/\/hey\.speak-to\.ai(\/[a-zA-Z0-9-]*)?$/;
          const match = url.match(domainPattern);

          if (match) {
            setIsValidDomain(true);
            const name = match[1] ? match[1].replace('/', '') : '';
            setAiTwinName(name);
            if (name) {
              fetchAITwinData(name);
            }
          } else {
            setIsValidDomain(false);
            setAiTwinName(null);
            setAiTwinData(null);
          }

          setQrCodeData(url);
        });
      }
    },
  });

  const handleAddToDiscover = async () => {
    if (aiTwinData) {
      const isAlreadyAdded = aiTwinsDiscovered.some(
        twin => twin.knowledgebaseId === aiTwinData.knowledgebaseId,
      );

      if (!isAlreadyAdded) {
        await addDiscoveredAITwin(aiTwinData);
      }
    }
  };

  const handleScanAgain = () => {
    setAiTwinData(null);
    setIsScanning(true);
    setLoading(false);
  };

  if (!device || !hasPermission) {
    return (
      <View style={styles.container}>
        <Spinner color="emerald.500" size="lg" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isScanning}
        codeScanner={codeScanner}
      />

      {loading ? (
        <View style={styles.qrCodeContainer}>
          <Spinner color="emerald.500" size="lg" />
          <Text style={styles.qrCodeText}>AI Twin found: Loading...</Text>
        </View>
      ) : (
        <>
          {aiTwinData && (
            <View style={styles.qrCodeContainer}>
              <Text style={styles.qrCodeText}>
                AI Twin found: {aiTwinData.name}
              </Text>
              <Image
                source={{uri: aiTwinData.avatar}}
                alt="AI Twin Avatar"
                size="lg"
                borderRadius={100}
                mb={4}
              />
              {aiTwinsDiscovered.some(
                twin => twin.knowledgebaseId === aiTwinData.knowledgebaseId,
              ) ? (
                <Box
                  mt={4}
                  p={3}
                  borderColor="green.500"
                  borderWidth={1}
                  borderRadius="md"
                  alignItems="center">
                  <Icon name={'checkmark-circle'} size={24} color={'green'} />
                  <Text style={{color: 'green'}}>AI Twin added</Text>
                </Box>
              ) : (
                <ButtonGroup variant="outline" space={2} mt={4}>
                  <Button onPress={handleScanAgain}>
                    <ButtonText>can Again</ButtonText>
                  </Button>
                  <Button onPress={handleAddToDiscover}>
                    <ButtonText>Add AI Twin to Discover</ButtonText>
                  </Button>
                </ButtonGroup>
              )}
            </View>
          )}
          {fetchError && (
            <View style={styles.qrCodeContainer}>
              <Text style={styles.qrCodeText}>
                No AI Twin found for the scanned code.
              </Text>
              <Button onPress={handleScanAgain} mt={4}>
                <ButtonText>Try Again</ButtonText>
              </Button>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  qrCodeContainer: {
    position: 'absolute',
    bottom: 20,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 8,
    alignItems: 'center',
  },
  qrCodeText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
});

export default QRCodeScanner;
