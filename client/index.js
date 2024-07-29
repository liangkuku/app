/**
 * @format
 */
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
// 实现uuid中的crypto.getRandomValues的polyfill
import 'react-native-get-random-values';

AppRegistry.registerComponent(appName, () => App);
