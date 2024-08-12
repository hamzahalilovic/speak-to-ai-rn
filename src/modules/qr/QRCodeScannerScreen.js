import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';

import DeviceInfo from 'react-native-device-info';

const QRCodeScannerScreen = () => {
  // Fix for simulators, remove after upgrade to new version of `react-native-vision-camera`
  const useGetCameraDevice = DeviceInfo.isEmulatorSync()
    ? () => undefined
    : useCameraDevice;

  const device = useGetCameraDevice('back');
  const {hasPermission, requestPermission} = useCameraPermission();
  const [qrCodeData, setQrCodeData] = useState(null);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      codes.forEach(code => {
        console.log('QR Code detected:', code);
        setQrCodeData(code.value);
      });
    },
  });

  if (!device || !hasPermission) {
    return (
      <View style={styles.container}>
        <Text>Loading camera...</Text>
      </View>
    );
  }

  console.log('QRCodeScannerScreen', qrCodeData);

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
      />
      {qrCodeData && (
        <View style={styles.qrCodeContainer}>
          <Text style={styles.qrCodeText}>QR Code Data: {qrCodeData}</Text>
        </View>
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
  },
  qrCodeText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default QRCodeScannerScreen;
