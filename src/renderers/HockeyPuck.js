import React from 'react';
import PropTypes from 'prop-types';

import {Image} from 'react-native';

import {hockeyPuck} from '../../assets/images';


HockeyPuck.propTypes = {
	body: PropTypes.object.isRequired,
	radius: PropTypes.number.isRequired,
};
export function HockeyPuck({body, radius}) {
	const x = body.position.x - radius / 2;
	const y = body.position.y - radius / 2;

	return (
		<Image
			source={hockeyPuck}
			style={{
				width: radius,
				height: radius,
				position: 'absolute',
				left: x,
				top: y,
			}}
		/>
	)
}