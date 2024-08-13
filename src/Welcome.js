import {useState} from 'react';
import {VStack, Text, Box, Image, Card} from '@gluestack-ui/themed-native-base';

function capitalizeNames(inputString) {
  inputString = inputString.toLowerCase();
  let words = inputString.split(' ');
  let capitalizedWords = words.map(
    word => word.charAt(0).toUpperCase() + word.slice(1),
  );
  return capitalizedWords.join(' ');
}

const WelcomeContainer = ({
  data,
  exampleText,
  asPartOfConvo = false,
  isMobile = true,
  ...props
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  // const theme = useTheme();

  return (
    <Box className="welcomeContainer" key={'init-2'} pl="10px" {...props}>
      <Box pt="10px" pb="32px">
        <VStack alignItems="center">
          <Box h="200px" position="relative" width="100%" overflow="hidden">
            <Image
              source={{uri: data.avatar}}
              alt="header"
              resizeMode="contain"
              onLoad={() => setImageLoaded(true)}
              style={{
                height: '100%',
                width: '100%',
                visibility: imageLoaded ? 'visible' : 'hidden',
                cursor: asPartOfConvo ? 'default' : 'pointer',
                position: 'relative',
              }}
            />
          </Box>
          {!asPartOfConvo && (
            <>
              <Text bold>{data.title}</Text>
              {/* <Text bold>Speak to AI {capitalizeNames(data.name)}</Text> */}

              <Box
                borderColor="#9E9E9E"
                w="80%"
                borderWidth={1}
                borderRadius={8}
                mt={4}
                p={4}>
                <Text textAlign="center">{exampleText}</Text>
              </Box>
            </>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default WelcomeContainer;
