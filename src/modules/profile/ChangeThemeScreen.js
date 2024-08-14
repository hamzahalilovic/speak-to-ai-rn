import React from 'react';
import {Box, Text, Switch, useTheme} from '@gluestack-ui/themed';

const ChangeThemeScreen = () => {
  return (
    <Box flex={1} alignItems="center" justifyContent="center">
      <Text mb={4}>Current Theme: </Text>
    </Box>
  );
};

export default ChangeThemeScreen;
