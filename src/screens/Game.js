import React from 'react';

import { View, Text } from 'react-native';


export function Game() {

	return (
		<View
			style={{ //style is present solely for start test purposes
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Text>
				Game Screen
			</Text>
		</View>
	)
}