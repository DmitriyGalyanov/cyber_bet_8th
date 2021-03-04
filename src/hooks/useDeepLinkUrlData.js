// import {useState, useEffect} from 'react';

// import {Linking} from 'react-native';

// import {log} from '../logger';

// /**
//  * Custom Hook that obtains deep link url data
//  * and returns a string with desired parameters
//  */
// export const useDeepLinkUrlData = () => {
// 	const [deepLinkUrlData, setDeepLinkUrlData] = useState('');

// 	useEffect(() => {
// 		Linking.addEventListener('url', (initDeepLinkUrlObj) => {
// 			log.deepLinkHook('Get deep link data through Linking.listener');
// 			log.deepLinkHook('initDeepLinkUrlObj:', initDeepLinkUrlObj);
// 			setDeepLinkUrlData(initDeepLinkUrlObj.url);
// 		});

// 		return () => {
// 			Linking.removeAllListeners('url');
// 		};
// 	}, []);

// 	useEffect(() => {
// 		Linking.getInitialURL()
// 		.then(initDeepLinkUrl => {
// 			log.deepLinkHook('Get deep link data through Linking.getInitialUrl()');
// 			log.deepLinkHook('initDeepLinkUrl:', initDeepLinkUrl)
// 			setDeepLinkUrlData(initDeepLinkUrl);
// 		});
// 		// const getUrl = async () => {
// 		// 	const initUrl = await Linking.getInitialURL();
// 		// 	console.log(initUrl)
// 		// 	setDeepLinkUrlData(initUrl);
// 		// };
// 		// getUrl();
// 	}, []);

// 	useEffect(() => {
// 		if (deepLinkUrlData && deepLinkUrlData.indexOf('?') !== -1) {
// 			setDeepLinkUrlData(deepLinkUrlData.split('?')[1]);
// 		};
// 	}, [deepLinkUrlData]);

// 	useEffect(() => {
// 		if (deepLinkUrlData && deepLinkUrlData.indexOf('&target_url') !== -1) {
// 			setDeepLinkUrlData(deepLinkUrlData.split('&target_url')[0]);
// 		};
// 	}, [deepLinkUrlData]);

// 	if (deepLinkUrlData?.indexOf('?') !== -1
// 	|| deepLinkUrlData?.indexOf('target_url') !== -1) {
// 		return '';
// 	};
// 	log.deepLinkHook('URL returned from useDeepLinkUrlData() hook', deepLinkUrlData);
// 	return deepLinkUrlData;
// };