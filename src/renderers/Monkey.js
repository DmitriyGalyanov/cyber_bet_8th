import React from 'react';

import {Image} from 'react-native';

import monkeyImg from '../../assets/images/monkey.png';


export default function Monkey({size, body}) {
	const width = size[0];
	const height = size[1];
	const x = body.position.x - width / 2;
	const y = body.position.y - height / 2;

	return (
		<Image
			source={monkeyImg}
			style={{
				width: width,
				height: height,
				position: 'absolute',
				left: x,
				top: y,
			}}
		/>
	)
}