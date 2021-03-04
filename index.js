import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import {appsflyerDevKey} from './src/constants';
import appsFlyer from 'react-native-appsflyer';

appsFlyer.initSdk(
	{
		devKey: appsflyerDevKey,
		isDebug: false,
	},
	result => {
		console.log('AppsFlyer SDK successfully initialized: ', result);
	},
	error => {
		console.error('AppsFlyer SDK initialization threw an error: ', error);
	}
);

AppRegistry.registerComponent(appName, () => App);