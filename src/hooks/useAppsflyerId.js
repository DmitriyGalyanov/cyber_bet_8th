import {useState, useEffect} from 'react';

import appsFlyer from 'react-native-appsflyer';

import {appsflyerDevKey} from '../constants';


/**
 * Custom hook that obtains AppsFlyer Unique ID
 * @returns {string} AppsFlyer Unique ID
 */
export const useAppsflyerId = () => {
	const [appsflyer_id, setAppsflyer_id] = useState('');

	useEffect(() => {
		appsFlyer.getAppsFlyerUID((err, appsflyerUID) => {
			if (err) {
				console.error(err);
			} else {
				// console.log('on getAppsFlyerUID: ' + appsflyerUID);
				setAppsflyer_id(appsflyerUID);
			}
		});
	}, []);

	return appsflyer_id;
};