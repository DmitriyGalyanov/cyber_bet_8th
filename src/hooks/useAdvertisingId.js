import {useState, useEffect} from 'react';

import {IDFA} from 'react-native-idfa';

/**
 * Custom hook that obtains Google Advertising ID
 * @returns {string} Google Advertising ID
 */
export const useAdvertisingId = () => {
	const [advertising_id, setAdvertising_id] = useState('');

	useEffect(() => {
		IDFA.getIDFA().then(idfa => {
			setAdvertising_id(idfa);
		})
		.catch(er => console.error(er));
	}, []);

	return advertising_id;
};