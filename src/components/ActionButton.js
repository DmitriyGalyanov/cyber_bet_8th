import React from 'react';
import PropTypes from 'prop-types';

import {TouchableOpacity, Text} from 'react-native';

import { mainBGColor, mainTextColor, windowWidth } from '../constants';


ActionButton.propTypes = {
	onPress: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
};
export function ActionButton ({onPress, title}) {
	return (
		<TouchableOpacity onPress={onPress}
			style={{
				minWidth: windowWidth * 0.8,
				paddingVertical: 16,
				backgroundColor: mainBGColor,
				borderRadius: 8,
				borderWidth: 2,
				borderColor: mainTextColor,
				elevation: 8,
			}}
		>
			<Text
				style={{
					color: mainTextColor,
					fontSize: 25,
					fontWeight: 'bold',
					textAlign: 'center',
				}}
			>
				{title}
			</Text>
		</TouchableOpacity>
	)
}
