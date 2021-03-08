import React, {useState, useEffect} from 'react';

import {Game, WebViewScreen} from './src/screens';

import { PercentageLoadingAlert } from './src/components';

import remoteConfig from '@react-native-firebase/remote-config';

import {
	useAppsflyerId,
} from './src/hooks';

import {
	appsflyerDevKey,
	bundleName,
	theXValue,
} from './src/constants';

import {log} from './src/logger';


const App = () => {
	/* get appsflyer unique device id */
	const appsflyer_id = useAppsflyerId();

	//gather remote config value(s) and set appropriate local (state) values
	const [depend_on, setDepend_on] = useState('');
	const [remoteConfigUrl, setRemoteConfigUrl] = useState('');
	const [x, setX] = useState(0);

	useEffect(() => {
		remoteConfig()
		.setDefaults({
			'depend_on': '', //'game' || 'remote_config'
			'url': '',
			'x': 0, //in this one it should be 11
		})
		.then(() => {
			return remoteConfig().setConfigSettings({
				minimumFetchIntervalMillis: 10000,
			})
		})
		.then(() => remoteConfig().fetchAndActivate())
		.then(fetchedRemotely => {
			setDepend_on(remoteConfig().getValue('depend_on').asString());
			setRemoteConfigUrl(remoteConfig().getValue('url').asString());
			setX(remoteConfig().getValue('x').asNumber());
		})
		.catch(er => {
			console.error(er);
			setDepend_on('game');
			//put an Alert with something like 'You need an Internet connection to fully utilize this application'??
		});
	}, []);

	//set remote config dependent final URL
	const [remoteConfigFinalUrl, setRemoteConfigFinalUrl] = useState('');

	useEffect(() => {
		if (remoteConfigUrl && appsflyer_id) { // && advertising_id // && x === theXValue
			setRemoteConfigFinalUrl(remoteConfigUrl.replace('{appsflyer_id}', appsflyer_id));
			// setRemoteConfigFinalUrl(`${remoteConfigUrl}?app_id=${bundleName}&authentication=${appsflyerDevKey}&appsflyer_id=${appsflyer_id}&advertising_id=${advertising_id}`);
		};
	}, [remoteConfigUrl, appsflyer_id]); //, advertising_id, x

	//set render component
	//webview render
	const [shouldRenderWebView, setShouldRenderWebView] = useState(false);

	useEffect(() => {
		if (remoteConfigFinalUrl && depend_on === 'remote_config' && x === theXValue) {
			setShouldRenderWebView(true);
			setShouldRenderGame(false);
		};
	}, [remoteConfigFinalUrl, depend_on, x]);

	//game render
	const [shouldRenderGame, setShouldRenderGame] = useState(false);

	useEffect(() => {
		if (depend_on === 'game') {
			setShouldRenderGame(true);
			setShouldRenderWebView(false);
		};
	}, [depend_on]);

	log.component_app_state('Should render Game:', shouldRenderGame, 'Should render WebView:', shouldRenderWebView);
	log.component_app_state('remoteConfigUrl (initial):', remoteConfigUrl);
	log.component_app_state('remoteConfigFinalUrl:', remoteConfigFinalUrl);
	log.component_app_state('depend_on:', depend_on, 'x:', x);

	//render block

	return (
		<>
			{!shouldRenderGame && !shouldRenderWebView && (
				<PercentageLoadingAlert alertText='loading...' />
			)}
			{shouldRenderGame && (
				<Game />
			)}
			{(shouldRenderWebView && remoteConfigFinalUrl !== '') && (
				<WebViewScreen url={remoteConfigFinalUrl} />
			)} 
		</>
	);
};

export default App;