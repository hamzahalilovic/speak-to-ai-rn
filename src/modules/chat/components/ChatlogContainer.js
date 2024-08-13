import React from 'react';
import {Box} from '@gluestack-ui/themed-native-base';

const ChatlogContainer = ({children, sidebarShown}) => {
  return (
    <Box
      flex={1}
      style={{zIndex: 3}}
      display={{base: 'block', md: 'block'}}
      width={{base: '100%', md: sidebarShown ? '80vw' : '90vw'}}
      maxWidth={{base: '100vw', md: sidebarShown ? '1536px' : '1728px'}}
      height="90vh"
      marginRight={{base: '0px', md: 'auto'}}
      marginLeft={{base: '0px', md: 'auto'}}
      marginBottom="auto"
      shadow="2">
      {children}
    </Box>
  );
};

export default ChatlogContainer;
