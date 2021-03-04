//window dimensions
import {Dimensions} from 'react-native';

const {width: windowWidth, height: windowHeight} = Dimensions.get('window');
export {windowWidth, windowHeight};

//game values NEW
//field settings
export const playFieldHeight = windowHeight * 0.80;
export const playFieldWidth = windowWidth * 0.9;
export const topFieldOffset = windowHeight * 0.15;
export const bottomFieldOffset = windowHeight * 0.1;
export const sideFieldOffset = windowWidth * 0.05;

export const verticalWallsHeight = 40;
export const horizontalWallsWidth = 40;

export const fieldGateWidth = playFieldWidth * 0.35;
export const fieldGateHeight = 8;

export const firstPlayerColor = 'red';
export const secondPlayerColor = 'blue';

//hockeyPuck entitity settings
export const hockeyPuckInitPosition = {
	x: playFieldWidth / 2,
	y: playFieldHeight / 2,
};
export const hockeyPuckRadius = 25;

// players entities settings
export const playerEntityRadius = 50;
export const playerSideOffset = Math.ceil(playerEntityRadius / 2);

//players positions
export const firstPlayerInitPosition = {
	x: playFieldWidth / 2,
	y: playFieldHeight * 0.85,
};
export const secondPlayerInitPosition = {
	x: playFieldWidth / 2,
	y: playFieldHeight * 0.15,
};

//styles
//colors
export const actionButtonBgColor = '#F5AB40';
export const mainBgColor = '#3D445F';

export const mainTextColor = '#fff';

// not game-logics related
export const appsflyerDevKey = 'Cb84BpRLyB5r2M9m8zjhfe';
export const bundleName = 'com.cyber_bet_8th';
export const theXValue = 11;