import React from 'react';
import PropTypes from 'prop-types';

import {
	StyleSheet,
	View,
} from 'react-native';
import {ActionButton} from './ActionButton';

import { windowHeight, windowWidth } from '../constants';


Overlay.propTypes = {
	setGameMode: PropTypes.func.isRequired,
}
export function Overlay ({setGameMode}) {

	return (
		<View style={styles.wrap}>
			<ActionButton onPress={() => setGameMode('twoPlayers')}
				title='Играть вдвоём'
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	wrap: {
		position: 'absolute',
		width: windowWidth,
		height: windowHeight,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(207, 207, 201, 0.4)',
		paddingBottom: windowHeight * 0.2,
	},
});

