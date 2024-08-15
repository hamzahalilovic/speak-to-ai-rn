import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Voice from '@react-native-voice/voice';
import LottieView from 'lottie-react-native';

import Sound from 'react-native-sound';

const ChatInput = React.forwardRef(
  (
    {value, onChangeText, onSubmitEditing, placeholder, editable, ...rest},
    ref,
  ) => {
    const [isRecording, setIsRecording] = useState(false);
    const [triggerSubmit, setTriggerSubmit] = useState(false);

    const recognitionTimeoutRef = useRef(null);

    useEffect(() => {
      Voice.onSpeechResults = e => {
        const text = e.value[0];
        onChangeText(text);
        clearTimeout(recognitionTimeoutRef.current);
        recognitionTimeoutRef.current = setTimeout(() => {
          setTriggerSubmit(true);
          setIsRecording(false);
          stopRecording();
        }, 500);
      };

      Voice.onSpeechEnd = () => {
        setIsRecording(false);
      };

      Voice.onSpeechError = e => {
        console.error('Voice recognition error:', e);
        setIsRecording(false);
      };

      return () => {
        Voice.destroy().then(Voice.removeAllListeners);
        clearTimeout(recognitionTimeoutRef.current);
      };
    }, []);

    useEffect(() => {
      if (triggerSubmit) {
        onSubmitEditing({nativeEvent: {text: value}});
        setTriggerSubmit(false);
      }
    }, [triggerSubmit]);

    const startRecording = async () => {
      try {
        setIsRecording(true);
        onChangeText(''); // Clear the input before starting a new recording
        await Voice.start('en-US');
        startRecordingSound.play();
      } catch (e) {
        console.error('Voice start error:', e);
        setIsRecording(false);
      }
    };

    const stopRecording = async () => {
      try {
        await Voice.stop();
        setIsRecording(false);
      } catch (e) {
        console.error('Voice stop error:', e);
        setIsRecording(false);
      }
    };

    ////sound need to add sounds to Xcode resources
    const startRecordingSound = new Sound(
      'begin_record.caf',
      Sound.MAIN_BUNDLE,
      error => {
        if (error) {
          console.error('Failed to load the sound', error);
          return;
        }
        startRecordingSound.play();
      },
    );

    return (
      <View style={styles.container}>
        <TextInput
          ref={ref}
          style={styles.input}
          value={isRecording ? '' : value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          placeholder={isRecording ? '' : placeholder}
          placeholderTextColor="#aaa"
          editable={isRecording ? false : editable}
          {...rest}
        />
        {isRecording && (
          <View style={styles.lottieContainer}>
            <LottieView
              source={require('../../../assets/lottie-animations/voice-recording.json')} // Update this with the correct path
              autoPlay
              loop
              style={styles.lottie}
            />
          </View>
        )}
        <TouchableOpacity
          onPress={isRecording ? stopRecording : startRecording}
          style={styles.voiceButton}
          disabled={!editable}>
          <Icon name={isRecording ? 'mic-off' : 'mic'} size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onSubmitEditing({nativeEvent: {text: value}})}
          style={styles.sendButton}
          disabled={!editable}>
          {editable ? (
            <Icon name="send" size={16} color="#fff" />
          ) : (
            <ActivityIndicator size="small" color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#212529',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  voiceButton: {
    marginLeft: 10,
  },
  sendButton: {
    marginLeft: 10,
  },
  lottieContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0, // Adjust this for padding
    right: 150, // Adjust this for padding
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  lottie: {
    width: 300, // Adjust size as needed
    height: 100,
  },
});

export default ChatInput;
