import React from 'react';
import {Text, View, Button} from '@gluestack-ui/themed-native-base';

import {useThemeContext} from '../../theme/ThemeContext';

const ChangeThemeScreen = () => {
  const {toggleTheme} = useThemeContext();

  return (
    <View style={{flex: 1, padding: 16, backgroundColor: 'background'}}>
      <Text fontSize={24} fontWeight={600} mb={4} color="text">
        Change theme Screen
      </Text>
      <Button onPress={toggleTheme} mt={4}>
        Toggle Theme
      </Button>
    </View>
  );
};

export default ChangeThemeScreen;
