//main
import {Dimensions} from 'react-native';

const {width: windowWidth, height: windowHeight} = Dimensions.get('window');
export {windowWidth, windowHeight};

//GAME VALUES
export const bottomPadding = 24;

export const itemDims = {
	width: 113,
	height: 100,
};

// World settings
export const INITIAL_GRAVITY = 0.15;
export const startingScore = 0;
export const THEME_COLOR = '#111';
export const contrastColor = 'white';
export const DEFAULT_ACCELERATOR_INTERVAL = 20;

// falling items settings
export const itemsLimit = 7;
export const itemWidth = 84.75;
export const itemHeight = 75;
export const ENTITY_LIST = [
	'gem',
	'bigGem',
	'goldCoin',
	'threeBigGems',
	'threeGoldCoins',
	'spike',
];
export const ENTITY_DETAILS = {
	gem: {
		height: itemHeight,
		width: itemWidth,
		name: 'gem',
		score: 4,
		probability: 0.015,
	},
	bigGem: {
		height: itemHeight,
		width: itemWidth,
		name: 'bigGem',
		score: 6,
		probability: 0.01,
	},
	goldCoin: {
		height: itemHeight,
		width: itemWidth,
		name: 'goldCoin',
		score: 1,
		probability: 0.02,
	},
	threeBigGems: {
		height: itemHeight,
		width: itemWidth,
		name: 'threeBigGems',
		score: 18,
		probability: 0.002,
	},
	threeGoldCoins: {
		height: itemHeight,
		width: itemWidth,
		name: 'threeGoldCoins',
		score: 3,
		probability: 0.015,
	},
	spike: {
		height: itemHeight,
		width: itemWidth,
		name: 'spike',
		score: 0,
		probability: 0.018,
	},
}

// Player entity settings
export const playerPhysicalWidth = 72;
export const playerPhysicalHeight = 72;
export const playerImgWidth = 120;
export const playerImgHeight = 200;

export const PLAYER_X_START = windowWidth / 2;
// export const PLAYER_Y_FIXED = windowHeight - playerImgHeight - bottomPadding - 24;
export const PLAYER_Y_FIXED = windowHeight - playerImgHeight * 1.5;

export const horizontalOffset = 12;
export const PLAYER_WIDTH_OFFSET = Math.ceil(playerImgWidth / 2); //

//GAME VALUES

//initial values
export const initialBalance = 200;

//styles
//colors
export const mainBGColor = '#D36D76';

export const mainTextColor = '#fff';


// not game-logics related
export const appsflyerDevKey = 'Cb84BpRLyB5r2M9m8zjhfe';
export const bundleName = 'com.cyber_bet_8th';
export const theXValue = 11;