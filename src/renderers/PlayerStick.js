import React from 'react';
import PropTypes from 'prop-types';

import {Image} from 'react-native';

import {firstPlayerImg, secondPlayerImg} from '../../assets/images';


PlayerStick.propTypes = {
	body: PropTypes.object.isRequired,
	size: PropTypes.arrayOf(PropTypes.number).isRequired,
	name: PropTypes.string.isRequired,
};
export function PlayerStick({body,size, name}) {
	const [width, height] = size;
	const x = body.position.x - width / 2;
	const y = body.position.y - height / 2;

	return (
		<Image
			source={name === 'firstPlayer' ? firstPlayerImg : secondPlayerImg}
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