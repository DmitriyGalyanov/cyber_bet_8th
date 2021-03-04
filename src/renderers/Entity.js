import React from 'react';
import {Image} from 'react-native';

import images from '../../assets/images/itemImages';


export default function item({size, name, body}) {
	const width = size[0];
	const height = size[1];
	const x = body.position.x - width / 2;
	const y = body.position.y - height / 2;

	return (
			<Image
				source={images[name]}
				style={{
					position: 'absolute',
					left: x,
					top: y,
					width: width,
					height: height,
				}}
			/>
	)
}
