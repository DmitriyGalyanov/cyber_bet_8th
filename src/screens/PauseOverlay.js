import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {CircleButton} from '../components';
import images from '../../assets/images';
import {THEME_COLOR} from '../constants';


export default function PauseOverlay({onPress}) {

	return (
		<View style={styles.container}>
			<View style={styles.textContainer} />
			<View style={styles.textContainer}>
				<Text style={styles.pauseText}>Paused</Text>
			</View>
			<View style={styles.btnsContainer}>
				<CircleButton
					image={images.back}
					onPress={onPress}
					borderStyle={styles.btnBorder}
					iconStyle={styles.btnIcon}
				/>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: THEME_COLOR,
		opacity: 0.85,
	},
	textContainer: {
		flex: 1,
		alignItems: 'center',
	},
	pauseText: {
		color: 'white',
		fontSize: 48,
		textAlign: 'center',
	},
	btnsContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-evenly',
	},
	btnBorder: {
		borderColor: 'white',
		borderRadius: 35,
		borderWidth: 5,
		paddingLeft: 10,
		paddingTop: 10,
		width: 70,
		height: 70,
	},
	btnIcon: {
		width: 40,
		height: 40,
		tintColor: 'white',
	},
})
