import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {View, Text, StyleSheet} from 'react-native';


const alertTextColor = '#BA88E1';
const percentageTextColor = '#E188C9';
const initialProgress = 0;
const maxProgress = 90;
const animTickDuration = 20;
const progressInTick = 1;

PercentageLoadingAlert.propTypes = {
	alertText: PropTypes.string.isRequired,
};
export function PercentageLoadingAlert({alertText}) {
	const [progress, setProgress] = useState(initialProgress);

	useEffect(() => {
		let progressTimeout;
		if (progress < maxProgress) {
			progressTimeout = setTimeout(() => {
				setProgress(progress + progressInTick);
			}, animTickDuration);
		};

		return () => {
			clearTimeout(progressTimeout);
		};
	}, [progress]);

	return (
		<View style={styles.wrap}>
			<Text style={styles.alertText}>
				{alertText}
			</Text>
			<Text
					style={{
						color: percentageTextColor
					}}
				>
					{progress}%
				</Text>
		</View>
	)
};

const styles = StyleSheet.create({
	wrap: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: 12,
	},
	alertText: {
		color: alertTextColor,
		fontSize: 16,
		marginBottom: 12,
	},
});