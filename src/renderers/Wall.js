import React from 'react';
import PropTypes from 'prop-types';

import {View} from 'react-native';


Wall.propTypes = {
	body: PropTypes.object.isRequired,
	size: PropTypes.arrayOf(PropTypes.number).isRequired,
};
/**
 * Only used in dev,
 * in DEV_MODE Renders a Wall || in PRODUCTION_MODE returns null
 * @param {{body: object, size: [number, number]}} props
 */
export function Wall({body, size}) {
	// if (!__DEV__) return null;
	return null;

	const [width, height] = size;

	const x = body.position.x - width / 2;
	const y = body.position.y - height / 2;

	return (
		<View
			style={{
				width: width,
				height: height,
				position: 'absolute',
				left: x,
				top: y,
				backgroundColor: 'yellow',
			}}
		/>
	)
}