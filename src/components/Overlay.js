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
	isPause: PropTypes.bool.isRequired,
};
export function Overlay ({setGameMode, resume, isPause}) {

	//add button for unpause
	return (
		<View style={styles.wrap}>
			<ActionButton onPress={() => setGameMode('twoPlayers')}
				title='Играть вдвоём'
			/>
			<ActionButton onPress={() => setGameMode('singlePlayer')}
				title='Играть с ботом'
			/>
			{isPause && (
				<ActionButton onPress={resume}
					title='Продолжить'
				/>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	wrap: {
		position: 'absolute',
		width: windowWidth,
		height: windowHeight,
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: 'rgba(207, 207, 201, 0.4)',
		paddingBottom: windowHeight * 0.4,
		paddingTop: windowHeight * 0.2,
	},
});

