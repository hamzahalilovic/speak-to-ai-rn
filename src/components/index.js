import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  Avatar,
  Box,
  Button,
  Text,
  Flex,
  HStack,
  VStack,
  Input,
  IconButton,
  Modal,
  ScrollView,
  useToast,
  Select,
  Textarea,
  Heading,
  Spacer,
  Card,
  Slide,
} from '@gluestack-ui/themed-native-base';
import {FaExclamationCircle, FaThumbsDown, FaThumbsUp} from 'react-icons/fa';
import {MdOutlinePrivacyTip} from 'react-icons/md';
import {PiWarningCircleLight} from 'react-icons/pi';
import {RxHamburgerMenu} from 'react-icons/rx';
import styled from 'styled-components/native';

import Icon from 'react-native-vector-icons/Ionicons';

import about from '../assets/about.svg';
import send from '../assets/send.svg';
import termsOfUse from '../assets/terms-of-use.svg';
import {links, showFeedback, themeColor, wisdomImage} from '../appConfig';
import {__} from '../utils/lng';
import {useShallow} from 'zustand/react/shallow';
import useStore from '../store/helper';
import {generalSystemPrompt} from '../utils/prompts';
// import {ExternalLinkIcon} from '@chakra-ui/icons';

// export const StyledSendSvg = styled(send)`
//   transform: rotate(-30deg);
//   width: 40px;
//   cursor: pointer;
//   top: -4px;
//   position: relative;
//   @media (max-width: 768px) {
//     width: 30px;
//   }
// `;

// export const StyledAboutSvg = styled(about)`
//   transform: rotate(-30deg);
//   width: 40px;
//   cursor: pointer;
//   top: -4px;
//   position: relative;
//   @media (max-width: 768px) {
//     width: 30px;
//   }
// `;

// export const StyledTermsOfUseSvg = styled(termsOfUse)`
//   transform: rotate(-30deg);
//   width: 40px;
//   cursor: pointer;
//   top: -4px;
//   position: relative;
//   @media (max-width: 768px) {
//     width: 30px;
//   }
// `;

// export const SplitDiv = styled(Box)`
//   border-top: 1px solid gray;
//   width: 100%;
//   padding-top: 2px;
//   li {
//     width: 49%;
//     @media (max-width: 768px) {
//       width: 100%;
//     }
//   }
// `;

// export const LeftSide = styled(Box)`
//   align-items: center;
// `;

// export const RightSide = styled(Box)`
//   justify-content: flex-end;
//   width: 100%;
// `;

// export const TextWithIcon = styled.div`
//   display: flex;
//   align-items: center;
//   svg {
//     margin-right: 0.5rem;
//   }
// `;

export const CommentButton = styled(Button)``;

export const ChakraAvatar = ({img}) => {
  return (
    <Box className="profile">
      <Avatar source={{uri: img}} size="md" />
    </Box>
  );
};

export const FeedBack = ({id, FeedBackClick, details, info, lang}) => {
  return (
    <SplitDiv id={`feedback-${id}`} className="feedbacks">
      <HStack>
        <LeftSide>
          <TextWithIcon>
            <Icon name={'home'} size={'14px'} color={'blue'} />
            <Text className="details-text">{details}</Text>
          </TextWithIcon>
        </LeftSide>
        {showFeedback && (
          <RightSide>
            <HStack alignItems="center">
              <Text>{__('Feedback:', lang)}</Text>
              <CommentButton
                variant="ghost"
                onClick={() => {
                  const comment = document.getElementById(`comment-${id}`);
                  comment.style.display =
                    comment.style.display === 'none' ? 'block' : 'none';
                }}>
                {__('Add comment', lang)}
              </CommentButton>
              <Flex h="100%">
                <IconButton
                  variant="ghost"
                  data-id={id}
                  data-element="thumbs-down"
                  onClick={FeedBackClick}
                  icon={<Icon name={'home'} size={'14px'} color={'blue'} />}
                />
                <IconButton
                  variant="ghost"
                  data-id={id}
                  data-element="thumbs-up"
                  onClick={FeedBackClick}
                  icon={<Icon name={'home'} size={'14px'} color={'blue'} />}
                />
              </Flex>
            </HStack>
            <Box id={`comment-${id}`} style={{display: 'none'}}>
              <VStack justifyContent="space-between" alignContent="end">
                <Textarea
                  id={`comment-text-${id}`}
                  placeholder={__('Enter comment here', lang)}
                />
                <Button
                  data-id={id}
                  data-element="comment"
                  onClick={FeedBackClick}>
                  {__('Send', lang)}
                </Button>
              </VStack>
            </Box>
          </RightSide>
        )}
      </HStack>
    </SplitDiv>
  );
};

export const Examples = ({lng, texts, onClick}) => {
  return (
    <Box className="exampleContainer" key="init-2" pl="10px">
      <Box pt="50px">
        <Text bold fontSize="xl">
          {__('Example question', lng)}
        </Text>
      </Box>
      <Box pt="10px" pb="32px">
        <VStack spacing="32px" align="stretch">
          <Box cursor="pointer" onClick={onClick}>
            <Text className="example">{texts}</Text>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export const CustomSlide = props => {
  if (!props.check) {
    return (
      <Slide
        in={!props.sidebarShown}
        placement="right"
        style={{zIndex: 2, backgroundColor: '#e2e2e2'}}>
        <Flex>{props.children}</Flex>
      </Slide>
    );
  } else {
    return props.children;
  }
};

export const FooterText = ({textData}) => {
  if (Array.isArray(textData)) {
    var linkIndex = 0;
    return (
      <>
        {textData.map(text => {
          if (typeof text === 'string') {
            return text;
          } else {
            return (
              <Text
                key={`link-${linkIndex++}`}
                textDecoration="underline"
                href={text.link}>
                {text.text}
              </Text>
            );
          }
        })}
      </>
    );
  } else {
    return textData;
  }
};

export const SidebarBottomLink = ({icon, event, text}) => {
  return (
    <Flex marginTop="20px" cursor="pointer" onClick={event}>
      <Flex
        width="30px"
        height="30px"
        marginRight="5px"
        justifyContent="center"
        alignItems="center">
        {icon}
      </Flex>
      <Text>{text}</Text>
    </Flex>
  );
};

export const SidebarSpeaker = ({speaker}) => {
  return (
    <Box
      w="100%"
      onClick={e => {
        const {speakerId, selectedSpeaker} = e.currentTarget.dataset;
        if (selectedSpeaker === 'false') {
          window.location.replace('/' + speakerId);
        }
        e.preventDefault();
      }}
      data-speaker-id={speaker.userId}
      data-selected-speaker={speaker.selected}>
      <HStack>
        <Box w="100%">
          <HStack m="2px" alignItems="start">
            <Avatar source={{uri: speaker['avatar-url']}} size="md" />
            <VStack>
              <Heading size="sm">{speaker.name}</Heading>
              <Text fontSize="x-small">{speaker.title}</Text>
            </VStack>
          </HStack>
        </Box>
        <Box>
          <Icon name={'home'} size={'14px'} color={'blue'} />
        </Box>
      </HStack>
    </Box>
  );
};

export const CustomSidebar = ({
  sidebarShown,
  showDisclaimerToast,
  sidebarSpeakers = [],
}) => {
  const [selectedModalDialog, setSelectedModalDialog] = useState(0);

  return (
    <>
      <Flex
        display={{base: 'flex', md: sidebarShown ? 'flex' : 'none'}}
        zIndex={1}
        flexDirection="column"
        width={{base: '100vw', md: '300px'}}
        backgroundColor="#3b2e8b"
        height="100vh"
        paddingTop="100px"
        paddingBottom="50px"
        paddingLeft="20px"
        color="white"
        marginRight="auto">
        <VStack marginTop="20px" cursor="pointer" w="95%">
          {sidebarSpeakers.length > 0 &&
            sidebarSpeakers.map((speaker, i) => (
              <SidebarSpeaker key={`sidebar-speaker-${i}`} speaker={speaker} />
            ))}
        </VStack>
        <Spacer />
        <SidebarBottomLink
          event={showDisclaimerToast}
          icon={<Icon name={'home'} size={14} color={'blue'} />}
          text="Show Disclaimer"
        />
        <SidebarBottomLink
          event={() => window.open(links.speakTo)}
          icon={<Icon name={'home'} size={14} color={'blue'} />}
          text="About Speak-to.ai"
        />
        <SidebarBottomLink
          event={() => window.open(links.termsOfUse)}
          icon={<Icon name={'home'} size={14} color={'blue'} />}
          text="Terms of Use"
        />
        <SidebarBottomLink
          event={() => window.open(links.privacyPolicy)}
          icon={<Icon name={'home'} size={14} color={'blue'} />}
          text="Privacy Policy"
        />
      </Flex>

      {selectedModalDialog === 1 && (
        <DebugDialog
          isOpen={selectedModalDialog === 1}
          onClose={() => {
            setSelectedModalDialog(0);
          }}
        />
      )}
    </>
  );
};

export const SidebarOpenButton = ({sidebarShown, openSidebar}) => {
  return (
    <Box
      id="sidebar-toggle"
      backgroundColor={{
        base: sidebarShown ? '#3b2e8b' : 'rgba(255, 255, 255, 0.5)',
        md: 'unset',
      }}
      backdropFilter="blur(5px)"
      position="absolute"
      borderRadius="5px"
      left="20px"
      top="20px"
      padding="2px"
      zIndex={5}>
      <Button
        color={sidebarShown ? 'white' : '#9f9f9f'}
        size="30px"
        onClick={openSidebar}
      />
    </Box>
  );
};

export const ChatlogContainer = props => {
  return (
    <Box
      style={{zIndex: 3}}
      display={{base: 'block', md: 'block'}}
      backgroundColor="white"
      width={{base: '100vw', md: props.sidebarShown ? '80vw' : '90vw'}}
      maxWidth={{base: '100vw', md: props.sidebarShown ? '1536px' : '1728px'}}
      height="90vh"
      marginRight={{base: '0px', md: 'auto'}}
      marginLeft={{base: '0px', md: 'auto'}}
      marginBottom="auto"
      borderBottomRightRadius="30px"
      borderBottomLeftRadius="30px">
      {props.children}
    </Box>
  );
};

export const CustomFooter = ({sidebarShown, textData, isMobile}) => {
  return (
    <Box
      width={isMobile ? '100%' : 'unset'}
      display={isMobile ? (sidebarShown ? 'none' : 'block') : 'block'}
      color="#8D8D8D"
      position="absolute"
      bottom="20px"
      textAlign="center"
      alignItems="center"
      justifyContent="center"
      zIndex={2}
      backgroundColor="#e2e2e2"
      paddingLeft={isMobile ? '0px' : sidebarShown ? '300px' : '0px'}
      alignSelf="center">
      {textData && (
        <>
          <Text textAlign="center" fontWeight={700}>
            <FooterText textData={textData[0]} />
          </Text>
        </>
      )}
    </Box>
  );
};

export const AnswerCard = ({
  knowledgeBase,
  message,
  handleFeedbackClick,
  language,
}) => {
  return (
    <Card variant="unstyled" mr={[0, '0px']} mb="20px">
      <Card className="answer ai">
        <HStack alignItems="normal">
          <Box>
            <ChakraAvatar img={knowledgeBase.avatar} />
          </Box>
          <Box w="100%">
            <Text fontWeight={600}>
              {knowledgeBase.title.substring(9, 11) === 'AI'
                ? knowledgeBase.title.substring(12) + ' AI'
                : knowledgeBase.title.substring(9)}
            </Text>
            <Box className="message" id={message.uniqueId}>
              {message.streaming && <Box className="dots" />}
              {message.streaming && <Box className="question-answer" />}
              {!message.streaming && (
                <>
                  <Box className="question-answer" data="response">
                    <Box
                    // dangerouslySetInnerHTML={{
                    //   __html: message.answer,
                    // }}
                    >
                      {message.answer}
                    </Box>
                  </Box>
                  {message.component && <Box>{message.component}</Box>}
                  {showFeedback && (
                    <>
                      <FeedBack
                        lang={language}
                        id={message.uniqueId}
                        FeedBackClick={handleFeedbackClick}
                        details={message.details}
                        info={message.info}
                      />
                    </>
                  )}
                </>
              )}
            </Box>
          </Box>
        </HStack>
      </Card>
    </Card>
  );
};

export const QuestionCard = ({message, isMobile}) => (
  <Card variant="unstyled" mr={[0, '0px']} mb="20px">
    <Card className="question user">
      <HStack spacing="10px">
        <Box>
          <Avatar size={isMobile ? 'sm' : 'md'} />
        </Box>
        <Box>
          <Text fontWeight={600}>You</Text>
          <Box
            className="message user-question"
            id={`user-${message.uniqueId}`}>
            {message.value}
          </Box>
        </Box>
      </HStack>
    </Card>
  </Card>
);

export const DebugDialog = ({isOpen, onClose}) => {
  const {getAIConfig, setAIConfig, defaultModel} = useStore(
    useShallow(state => ({
      getAIConfig: state.getAIConfig,
      setAIConfig: state.setAIConfig,
      defaultModel: state.defaultModel,
    })),
  );
  const effectCalled = useRef(false);
  const [aiConfigDefault, setAiConfigDefault] = useState({});
  const inputs = useRef({});

  useEffect(() => {
    if (!effectCalled.current) {
      effectCalled.current = true;
      const aiConfig = getAIConfig();
      setAiConfigDefault({
        generalSystemPrompt: aiConfig.generalSystemPrompt.join('\n'),
        appSystemPrompt:
          aiConfig.appSystemPrompt !== ''
            ? aiConfig.appSystemPrompt.join('\n')
            : [],
        speakerSystemPrompt:
          aiConfig.speakerSystemPrompt !== ''
            ? aiConfig.speakerSystemPrompt.join('\n')
            : [],
        messageAddon: aiConfig.messageAddon,
        models: aiConfig.models,
        llms: Object.keys(aiConfig.models),
        defaultModel: aiConfig.defaultModel,
        temperature: aiConfig.temperature,
        maxTokens: aiConfig.maxTokens,
      });
    }
  }, [getAIConfig, defaultModel]);

  const saveAIConfig = () => {
    const aiConfig = {
      generalSystemPrompt:
        inputs.current['generalSystemPrompt'].value.split('\n'),
      appSystemPrompt: inputs.current['appSystemPrompt'].value.split('\n'),
      speakerSystemPrompt:
        inputs.current['speakerSystemPrompt'].value.split('\n'),
      messageAddon: inputs.current['addOns'].value,
      llm: inputs.current['llm'].value,
      checksum: 'NOT-USED',
      temperature: Number(inputs.current['temperature'].children[0].value),
      maxTokens: Number(inputs.current['tokens'].children[0].value),
    };
    setAIConfig(aiConfig);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <Modal.Content>
        <Modal.Body>
          <Flex paddingTop="10px" paddingBottom="10px" flexDirection="column">
            <Text>General System Prompt</Text>
            <Textarea
              rows={6}
              variant="filled"
              ref={el => {
                if (el) {
                  inputs.current['generalSystemPrompt'] = el;
                }
              }}
              defaultValue={aiConfigDefault.generalSystemPrompt}
            />
          </Flex>
          <Flex paddingTop="10px" paddingBottom="10px" flexDirection="column">
            <Text>Application System Prompt</Text>
            <Textarea
              rows={3}
              variant="filled"
              ref={el => {
                if (el) {
                  inputs.current['appSystemPrompt'] = el;
                }
              }}
              defaultValue={aiConfigDefault.appSystemPrompt}
            />
          </Flex>
          <Flex paddingTop="10px" paddingBottom="10px" flexDirection="column">
            <Text>Speaker System Prompt</Text>
            <Textarea
              rows={3}
              variant="filled"
              ref={el => {
                if (el) {
                  inputs.current['speakerSystemPrompt'] = el;
                }
              }}
              defaultValue={aiConfigDefault.speakerSystemPrompt}
            />
          </Flex>
          <Flex paddingTop="10px" paddingBottom="10px" flexDirection="column">
            <Text>Messages Addon</Text>
            <Textarea
              rows={4}
              variant="filled"
              ref={el => {
                if (el) {
                  inputs.current['addOns'] = el;
                }
              }}
              defaultValue={aiConfigDefault.messageAddon}
            />
          </Flex>
          <Flex paddingTop="10px" paddingBottom="10px" flexDirection="column">
            <Text>LLMs</Text>
            {aiConfigDefault.defaultModel && (
              <Select
                ref={el => {
                  if (el) {
                    inputs.current['llm'] = el;
                  }
                }}
                placeholder="Select LLM"
                defaultValue={aiConfigDefault.defaultModel}>
                {aiConfigDefault.llms.map((opt, cid) => (
                  <option key={`option-${cid}`} value={opt} data-value={opt}>
                    {opt}
                  </option>
                ))}
              </Select>
            )}
          </Flex>
          <Flex paddingTop="10px" paddingBottom="10px" flexDirection="row">
            <Box w="100px">
              <Text>Temperature: </Text>
              {aiConfigDefault.temperature !== undefined && (
                <NumberInput
                  ref={el => {
                    if (el) {
                      inputs.current['temperature'] = el;
                    }
                  }}
                  defaultValue={aiConfigDefault.temperature}
                  min={0}
                  max={1}
                  precision={1}
                  step={0.1}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              )}
            </Box>
            <Box ml={50} w="100px">
              <Text>Tokens: </Text>
              {aiConfigDefault.maxTokens && (
                <NumberInput
                  ref={el => {
                    if (el) {
                      inputs.current['tokens'] = el;
                    }
                  }}
                  defaultValue={aiConfigDefault.maxTokens}
                  min={50}
                  max={2000}
                  precision={0}
                  step={10}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              )}
            </Box>
          </Flex>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={e => {
              e.preventDefault();
              saveAIConfig();
            }}>
            Save
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default FeedBack;
