import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

import ScannerScreen from './ScannerScreen';
import QRCodeScanner from './QRCodeScanner';

function ScannerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ScannerScreen"
        component={ScannerScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen name="QRCodeScanner" component={QRCodeScanner} />
    </Stack.Navigator>
  );
}

export default ScannerStack;
