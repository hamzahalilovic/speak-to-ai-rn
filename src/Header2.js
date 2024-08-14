import React from 'react';
import {Box, IconButton, HStack} from '@gluestack-ui/themed';
import {headerOptions} from './appConfig';

const Header = ({onClose, onOpen, isOpen = false, isMobile, ...props}) => {
  return (
    <Box
      pl={[0, 5, 5, 5]}
      height={headerOptions.height}
      backgroundColor={headerOptions.backgroundColor}
      {...props}
      position={isMobile ? 'sticky' : 'fixed'}
      top={0}
      left={0}
      right={0}>
      <HStack h="100%" alignItems="center">
        <Box />
        {/* 
        {!isOpen &&
          <IconButton
            variant="ghost"
            icon={<HamburgerIcon boxSize="1.7em" onClick={onOpen} />}
          />
        } */}
      </HStack>
    </Box>
  );
};

export default Header;
