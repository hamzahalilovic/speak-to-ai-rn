/**
 * @format
 */

import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import {ReadableStream} from 'web-streams-polyfill';

globalThis.ReadableStream = ReadableStream;

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

console.warn = () => {};
console.error = () => {};
console.log = () => {};

AppRegistry.registerComponent(appName, () => App);
