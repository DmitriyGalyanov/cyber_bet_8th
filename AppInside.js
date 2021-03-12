import React, {useState, useEffect} from 'react';

import { PercentageLoadingAlert } from './src/components';
import {Game, WebViewScreen} from './src/screens';

import remoteConfig from '@react-native-firebase/remote-config';

import {
	// useDeepLinkUrlData,
	useAppsflyerId,
	// useAdvertisingId,
} from './src/hooks';

import { useSelector, useDispatch } from 'react-redux';
import {
	selectWebViewData,
	// setDeepLinkUrlData as setStorageDeepLinkUrlData,
	setFinalUrl as setStorageFinalUrl,
	setRemoteConfigUrl as setStorageRemoteConfigUrl,
	setShouldRenderWebViewExclusively,
} from './src/redux/stateSlices';

//logging
import {log} from './src/logger';


export default function AppInside() {
	//get appsflyer unique device id
	const appsflyer_id = useAppsflyerId();

	/* get google advertising id
	const advertising_id = useAdvertisingId(); */

	//return for tests EXCLUSIVELY
	// return (
	// 	<PercentageLoadingAlert alertText='loading...'/>
	// );

	/* deep linking */
	// const deepLinkUrlData = useDeepLinkUrlData();

	/* obtain data from redux persist */
	const {
		remoteConfigUrl: remoteConfigUrlFromStorage,
		// deepLinkUrlData: deepLinkUrlDataFromStorage,
		finalUrl: finalUrlFromStorage,
		shouldRenderWebViewExclusively,
	} = useSelector(selectWebViewData);

	log.webview_data_from_storage('remoteConfigUrl:', remoteConfigUrlFromStorage);
	// log.webview_data_from_storage('deepLinkUrlData:', deepLinkUrlDataFromStorage);
	log.webview_data_from_storage('finalUrl:', finalUrlFromStorage);
	log.webview_data_from_storage('shouldRenderWebViewExclusively:', shouldRenderWebViewExclusively);

	const dispatch = useDispatch();

	/* gather remote config value(s) and set appropriate local (state) values */
	const [depend_on, setDepend_on] = useState('');
	const [remoteConfigUrl, setRemoteConfigUrl] = useState('');

	useEffect(() => {
		if (shouldRenderWebViewExclusively && finalUrlFromStorage) {
			log.returns('RETURN at \'Gathering remote data\'');
			return;
		};
		log.info('Gathering remote data');
		remoteConfig()
		.setDefaults({
			'depend_on': '', //'game' || 'remote_config'
			'url': '',
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
		})
		.catch(er => {
			console.error(er);
			setDepend_on('game');
		});
	}, [shouldRenderWebViewExclusively, finalUrlFromStorage]);

	/* setting storage values */
	useEffect(() => {
		if (remoteConfigUrl) {
			log.setters('setting remoteConfigUrlFromStorage since remoteConfigUrl is present');
			let remoteConfigFinalUrl = remoteConfigUrl.replace('{appsflyer_id}', appsflyer_id);
			remoteConfigFinalUrl = remoteConfigFinalUrl.replace('%7Bappsflyer_id%7D', appsflyer_id);
			dispatch(setStorageRemoteConfigUrl(remoteConfigFinalUrl));
		};
	}, [remoteConfigUrl]);
	useEffect(() => {
		if (remoteConfigUrlFromStorage) {
			log.setters('Setting finalUrlFromStorage since remoteConfigUrlFromStorage is present');
			dispatch(setStorageFinalUrl(`${remoteConfigUrlFromStorage}`));
		};
	}, [remoteConfigUrlFromStorage]);
	useEffect(() => {
		if (finalUrlFromStorage && (depend_on === 'remote_config')) {
			log.setters('setting shouldRenderWebViewExclusively to true since finalUrlFromStorage is present');
			dispatch(setShouldRenderWebViewExclusively(true));
		};
	}, [finalUrlFromStorage]);
	useEffect(() => {
		if (depend_on === 'remote_config' && finalUrlFromStorage) {
			log.setters('setting shouldRenderWebViewExclusively to true since depend_on === \'remote_config\' and finalUrlFromStorage is present');
			dispatch(setShouldRenderWebViewExclusively(true));
		};
	}, [depend_on, finalUrlFromStorage]);

	/* set render component */
	// game render
	const [shouldRenderGame, setShouldRenderGame] = useState(false);
	useEffect(() => {
		if (!shouldRenderWebViewExclusively && depend_on === 'game') {
			log.setters('setting shouldRenderGame to true since shouldRenderWebViewExclusively !== true');
			setShouldRenderGame(true);
			console.log('false log');
			return;
		};
		log.setters('setting shouldRenderGame to false since shouldRenderWebViewExclusively === true')
		setShouldRenderGame(false);
	}, [shouldRenderWebViewExclusively, depend_on]);

	/* component state logging */
	log.component_state('Should render Game:', shouldRenderGame);
	log.component_state('remoteConfigUrl (from Remote Config):', remoteConfigUrl);
	log.component_state('depend_on:', depend_on);

	//render block
	return (
		<>
			{!shouldRenderGame && !shouldRenderWebViewExclusively && (
				<PercentageLoadingAlert alertText='loading...'/>
			)}
			{shouldRenderGame && (
				<Game />
			)}
			{(shouldRenderWebViewExclusively && finalUrlFromStorage) && (
				<WebViewScreen url={finalUrlFromStorage} />
			)}
		</>
	);
};