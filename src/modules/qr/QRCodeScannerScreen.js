// import React from 'react';
// import {Alert, StyleSheet, View} from 'react-native';
// import QRCodeScanner from 'react-native-qrcode-scanner';
// import {RNCamera} from 'react-native-camera';
// import {Text} from 'native-base';

// const QRCodeScannerScreen = ({navigation}) => {
//   const onSuccess = e => {
//     Alert.alert('QR Code Scanned', `Value: ${e.data}`, [
//       {
//         text: 'OK',
//         onPress: () => navigation.goBack(),
//       },
//     ]);
//   };

//   return (
//     <View style={{flex: 1}}>
//       <QRCodeScanner
//         onRead={onSuccess}
//         flashMode={RNCamera.Constants.FlashMode.off}
//         topContent={
//           <Text fontSize={18} fontWeight="bold" mb={4}>
//             Scan the QR code
//           </Text>
//         }
//         bottomContent={
//           <Text fontSize={14} color="gray.500">
//             Align the QR code within the frame to scan
//           </Text>
//         }
//         containerStyle={styles.container}
//         cameraStyle={styles.camera}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   camera: {
//     height: '100%',
//   },
// });

// export default QRCodeScannerScreen;
import React from 'react';
import {Alert, StyleSheet, View} from 'react-native';

import {Text} from 'native-base';

const QRCodeScannerScreen = ({navigation}) => {
  return (
    <View style={{flex: 1, padding: 16, paddingTop: 55}}>
      <Text fontSize={24} fontWeight={600} lineHeight={33} mb={4}>
        QR Code Scan
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    height: '100%',
  },
});

export default QRCodeScannerScreen;
