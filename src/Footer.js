import React, {forwardRef, useEffect, useRef} from 'react';
import {Box, HStack, TextArea, IconButton, useTheme} from 'native-base';
// import {FiSend} from 'react-icons/fi';
import {EVALS, themeColor} from './appConfig';
import autosize from 'autosize';

function useMergedRefs(...refs) {
  return React.useMemo(() => {
    if (refs.every(ref => ref == null)) {
      return null;
    }
    return node => {
      refs.forEach(ref => {
        if (ref) {
          if (typeof ref === 'function') {
            ref(node);
          } else {
            ref.current = node;
          }
        }
      });
    };
  }, [refs]);
}

const Footer = forwardRef(({newMessage, onMounted}, ref) => {
  const internalRef = useRef(null);
  const mergedRef = useMergedRefs(internalRef, ref);
  const theme = useTheme();

  useEffect(() => {
    if (onMounted) {
      onMounted();
    }
  }, [onMounted]);

  useEffect(() => {
    if (internalRef.current) {
      autosize(internalRef.current);
    }
  }, []);

  return (
    <HStack
      borderColor={themeColor}
      borderWidth={1}
      borderRadius={8}
      alignItems="center"
      p={2}>
      <Box flex={1}>
        <TextArea
          data="input-field"
          id="footer-statement"
          w="100%"
          data-status="ready"
          data-testid="statement"
          ref={mergedRef}
          h={`${EVALS.defaultHeight}px`}
          maxHeight="250px"
          minHeight={`${EVALS.defaultHeight}px`}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (ref.current.value !== '') {
                newMessage(e);
              }
            }
          }}
          maxLength={600}
        />
      </Box>
      <IconButton
        // icon={<FiSend style={{width: '1.5em', height: '1.5em'}} />}
        onPress={e => {
          e.preventDefault();
          if (ref.current.value !== '') {
            newMessage(e);
          }
        }}
        _icon={{
          // color: theme.colors[themeColor],
          color: 'red',
        }}
      />
    </HStack>
  );
});

// Footer.displayName = 'Footer';
export default Footer;
