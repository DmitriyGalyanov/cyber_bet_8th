import React from 'react';
import PropTypes from 'prop-types';

import {View} from 'react-native';
import { firstPlayerColor, secondPlayerColor } from '../constants';


FieldGate.propTypes = {
	body: PropTypes.object.isRequired,
	size: PropTypes.arrayOf(PropTypes.number).isRequired,
};
/**
 * @param {{body: object, size: [number, number]}} props
 */
export function FieldGate({body, size, name}) {
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
				backgroundColor: name === 'firstPlayerGate' ? firstPlayerColor : secondPlayerColor,
			}}
		/>
	)
}