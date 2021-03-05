import React, {PureComponent} from 'react';
import {
	ImageBackground,
	StatusBar,
	StyleSheet,
	Text,
	View,
	Modal,
	TouchableOpacity,
	Image,
} from 'react-native';
import {Overlay} from '../components';

import Matter from 'matter-js';
import {GameEngine} from 'react-native-game-engine';

import {FieldGate, HockeyPuck, PlayerStick, Wall} from '../renderers';
import {Physics} from '../systems';

import {
	windowWidth,
	windowHeight,
	firstPlayerInitPosition,
	secondPlayerInitPosition,
	playerSideOffset,
	playerEntityRadius,
	playFieldWidth,
	playFieldHeight,
	bottomFieldOffset,
	topFieldOffset,
	sideFieldOffset,
	hockeyPuckInitPosition,
	hockeyPuckRadius,
	verticalWallsHeight,
	horizontalWallsWidth,
	fieldGateHeight,
	fieldGateWidth,
	mainBgColor,
	firstPlayerColor,
	secondPlayerColor,
	mainTextColor,
	middleWall_collisionCategory,
	player_collisionCategory,
	hockeyPuck_collisionCategory,
	fieldBorders_collisionCategory,
} from '../constants';

import {fieldBg, pause as pauseIcon} from '../../assets/images';
import { getRandomIntInclusive } from '../helpers';


export class Game extends PureComponent {
	constructor(props) {
		super(props)
		this.state = {
			running: false,
			pause: false,

			firstPlayerScore: 0,
			secondPlayerScore: 0,

			gameMode: '',
		}

		this.gameEngine = null;
		this.entities = this._setupWorld();
	};

	resetHockeyPuck = () => {
		Matter.Body.setPosition(
			this.hockeyPuckEntity,
			hockeyPuckInitPosition,
		);
		let randomXVelocity = getRandomIntInclusive(-8, 8);
		while (Math.abs(randomXVelocity) < 3) {
			randomXVelocity = getRandomIntInclusive(-8, 8);
		};
		let randomYVelocity = getRandomIntInclusive(-8, 8);
		while (Math.abs(randomYVelocity) < 3) {
			randomYVelocity = getRandomIntInclusive(-8, 8);
		};
		Matter.Body.setVelocity(
			this.hockeyPuckEntity,
			{
				x: randomXVelocity,
				y: randomYVelocity,
			}
		);
	};

	resetPlayers = () => {
		Matter.Body.setPosition(
			this.firstPlayerEntity,
			firstPlayerInitPosition,
		);
		Matter.Body.setPosition(
			this.secondPlayerEntity,
			secondPlayerInitPosition,
		);
	};

	resetScore = () => {
		this.setState({
			firstPlayerScore: 0,
			secondPlayerScore: 0,
		});
	};

	setGameMode = (modeName) => {
		this.setState({
			gameMode: modeName,
			running: true,
			pause: false,
		});
		this.resetHockeyPuck();
		this.resetPlayers();
		this.resetScore();
		if (modeName === 'singlePlayer') {
			let randomXVelocity = getRandomIntInclusive(-8, 8);
			while (Math.abs(randomXVelocity) < 3) {
				randomXVelocity = getRandomIntInclusive(-8, 8);
			};
			let randomYVelocity = getRandomIntInclusive(-8, 8);
			while (Math.abs(randomYVelocity) < 3) {
				randomYVelocity = getRandomIntInclusive(-8, 8);
			};
			Matter.Body.setStatic(this.secondPlayerEntity, false);
			Matter.Body.setVelocity(
				this.secondPlayerEntity,
				{
					x: randomXVelocity,
					y: randomYVelocity,
				}
			);
		} else if (modeName === 'twoPlayers') {
			Matter.Body.setStatic(this.secondPlayerEntity, true);
		};
	};

	setPause = () => {
		this.setState({running: false, pause: true});
	};
	resume = () => {
		this.setState({running: true, pause: false});
	};

	playersMovement = (entities, { touches }) => {
		touches.filter(touch => touch.type === 'move').forEach(touch => {
			const touchLocationX = touch.event.pageX;
			const touchLocationY = touch.event.pageY;

			const firstPlayer = entities.firstPlayer;
			if (firstPlayer && (touchLocationY > (windowHeight) / 2 + playerSideOffset)) {
				let newFirstPlayerPositionX = touchLocationX - sideFieldOffset;
				if (newFirstPlayerPositionX > (windowWidth - sideFieldOffset * 2) - playerSideOffset) { //right field border
					newFirstPlayerPositionX = (windowWidth - sideFieldOffset * 2) - playerSideOffset;
				} else if (newFirstPlayerPositionX <= playerSideOffset) { //left field border
					newFirstPlayerPositionX = playerSideOffset;
				};
				let newFirstPlayerPositionY = touchLocationY - topFieldOffset;
				if (newFirstPlayerPositionY < (windowHeight - topFieldOffset - bottomFieldOffset) / 2 + playerSideOffset) { //middle field border
					newFirstPlayerPositionY = (windowHeight - topFieldOffset - bottomFieldOffset) / 2 + playerSideOffset;
				} else if (newFirstPlayerPositionY > (playFieldHeight) - playerSideOffset) { //lower field border
					newFirstPlayerPositionY = (playFieldHeight) - playerSideOffset;
				};
				Matter.Body.setPosition(this.firstPlayerEntity, {
					x: newFirstPlayerPositionX,
					y: newFirstPlayerPositionY,
				});
			};
			if (this.state.gameMode === 'singlePlayer') return;
			const secondPlayer = entities.secondPlayer;
			if (secondPlayer && (touchLocationY < (windowHeight) / 2 + playerSideOffset)) {
				let newSecondPlayerPositionX = touchLocationX - sideFieldOffset;
				if (newSecondPlayerPositionX > (windowWidth - sideFieldOffset * 2) - playerSideOffset) { //right field border
					newSecondPlayerPositionX = (windowWidth - sideFieldOffset * 2) - playerSideOffset;
				} else if (newSecondPlayerPositionX <= playerSideOffset) { //left field border
					newSecondPlayerPositionX = playerSideOffset;
				};
				let newSecondPlayerPositionY = touchLocationY - topFieldOffset;
				if (newSecondPlayerPositionY > (windowHeight - topFieldOffset - bottomFieldOffset) / 2 + playerSideOffset) { //middle field border
					newSecondPlayerPositionY = (windowHeight - topFieldOffset - bottomFieldOffset) / 2 + playerSideOffset;
				} else if (newSecondPlayerPositionY < playerSideOffset) { //top field border
					newSecondPlayerPositionY = playerSideOffset;
				};
				Matter.Body.setPosition(this.secondPlayerEntity, {
					x: newSecondPlayerPositionX,
					y: newSecondPlayerPositionY,
				});
			};
		});

		return entities;
	};

	handleFirstPlayerGateHit = () => {
		this.setState(prevState => ({
			secondPlayerScore: prevState.secondPlayerScore + 1,
		}), () => {
			// this.setPause();
			this.resetHockeyPuck();
		});
	};
	handleSecondPlayerGateHit = () => {
		this.setState(prevState => ({
			firstPlayerScore: prevState.firstPlayerScore + 1,
		}), () => {
			// this.setPause();
			this.resetHockeyPuck();
		});
	};

	_setupWorld = () => {
		const engine = Matter.Engine.create({enableSleeping: false});
		const world = engine.world;
		world.gravity.y = 0;

		//field border
		this.topFieldBorder = Matter.Bodies.rectangle(
			playFieldWidth / 2,
			- verticalWallsHeight / 2, //0
			playFieldWidth,
			verticalWallsHeight,
			{
				isStatic: true,
				label: 'topFieldBorder',
				restitution: 1,
			}
		);
		this.topFieldBorder.collisionFilter.category = fieldBorders_collisionCategory;
		this.topFieldBorder.collisionFilter.mask = player_collisionCategory | fieldBorders_collisionCategory;
		this.bottomFieldBorder = Matter.Bodies.rectangle(
			playFieldWidth / 2,
			playFieldHeight + verticalWallsHeight / 2,
			playFieldWidth,
			verticalWallsHeight,
			{
				isStatic: true,
				label: 'bottomFieldFloor',
				restitution: 1,
			}
		);
		this.bottomFieldBorder.collisionFilter.category = fieldBorders_collisionCategory;
		this.bottomFieldBorder.collisionFilter.mask = player_collisionCategory | fieldBorders_collisionCategory;
		this.leftFieldBorder = Matter.Bodies.rectangle(
			-horizontalWallsWidth / 2 - 4,
			playFieldHeight / 2,
			horizontalWallsWidth,
			windowHeight,// playFieldHeight
			{
				isStatic: true,
				label: 'leftFieldBorder',
				restitution: 1,
			}
		);
		this.leftFieldBorder.collisionFilter.category = fieldBorders_collisionCategory;
		this.leftFieldBorder.collisionFilter.mask = player_collisionCategory | fieldBorders_collisionCategory;
		this.rightFieldBorder = Matter.Bodies.rectangle(
			playFieldWidth + horizontalWallsWidth / 2,
			playFieldHeight / 2,
			horizontalWallsWidth,
			windowHeight, //playFieldHeight
			{
				isStatic: true,
				label: 'rightFieldBorder',
				restitution: 1,
			}
		);
		this.rightFieldBorder.collisionFilter.category = fieldBorders_collisionCategory;
		this.rightFieldBorder.collisionFilter.mask = player_collisionCategory | fieldBorders_collisionCategory;
		this.middleFieldBorder = Matter.Bodies.rectangle( //should only interact with bot
			playFieldWidth / 2,
			(playFieldHeight) / 2,
			playFieldWidth,
			verticalWallsHeight,
			{
				isStatic: true,
				label: 'middleFieldBorder',
				restitution: 1,
			}
		);
		this.middleFieldBorder.collisionFilter.category = middleWall_collisionCategory;
		this.middleFieldBorder.collisionFilter.mask = player_collisionCategory;
		Matter.World.add(world, [
			this.topFieldBorder,
			this.bottomFieldBorder,
			this.leftFieldBorder,
			this.rightFieldBorder,
			this.middleFieldBorder,
		]);
		this.firstPlayerGate = Matter.Bodies.rectangle(
			playFieldWidth / 2,
			playFieldHeight - fieldGateHeight / 2,
			fieldGateWidth,
			fieldGateHeight,
			{
				isSensor: true,
				isStatic: true,
				label: 'firstPlayerGate',
			}
		);
		this.secondPlayerGate = Matter.Bodies.rectangle(
			playFieldWidth / 2,
			- fieldGateHeight / 2 + fieldGateHeight,
			fieldGateWidth,
			fieldGateHeight,
			{
				isSensor: true,
				isStatic: true,
				label: 'secondPlayerGate',
			}
		);
		Matter.World.add(world, [
			this.firstPlayerGate,
			this.secondPlayerGate,
		]);

		// players entities
		this.firstPlayerEntity = Matter.Bodies.circle(
			firstPlayerInitPosition.x,
			firstPlayerInitPosition.y,
			playerEntityRadius / 2,
			{isStatic: true, label: 'firstPlayer'},
		);
		this.firstPlayerEntity.collisionFilter.category = player_collisionCategory;
		this.firstPlayerEntity.collisionFilter.mask = middleWall_collisionCategory | hockeyPuck_collisionCategory | fieldBorders_collisionCategory;
		Matter.World.add(world, this.firstPlayerEntity);

		this.secondPlayerEntity = Matter.Bodies.circle(
			secondPlayerInitPosition.x,
			secondPlayerInitPosition.y,
			playerEntityRadius / 2,
			{
				isStatic: false, //sets to false if single player
				label: 'secondPlayer',
				inertia: Infinity,
				inverseInertia: 0,
				restitution: 1,
				friction: 0,
				frictionAir: 0,
				frictionStatic: 0,
			}
		);
		this.secondPlayerEntity.collisionFilter.category = player_collisionCategory;
		this.secondPlayerEntity.collisionFilter.mask = middleWall_collisionCategory | hockeyPuck_collisionCategory | fieldBorders_collisionCategory;
		Matter.World.add(world, this.secondPlayerEntity);
		//hockey puck entity
		this.hockeyPuckEntity = Matter.Bodies.circle(
			hockeyPuckInitPosition.x,
			hockeyPuckInitPosition.y,
			hockeyPuckRadius / 2,
			{
				inertia: Infinity,
				restitution: 1,
				friction: 0,
				frictionAir: 0,
				frictionStatic: 0,
				label: 'hockeyPuck',
			}
		);
		this.hockeyPuckEntity.collisionFilter.category = hockeyPuck_collisionCategory;
		this.hockeyPuckEntity.collisionFilter.mask = player_collisionCategory | fieldBorders_collisionCategory;
		Matter.World.add(world, this.hockeyPuckEntity);

		//collisions handling
		const firstPlayerEntityId = this.firstPlayerEntity.id;
		const secondPlayerEntityId = this.secondPlayerEntity.id;
		const hockeyPuckEntityId = this.hockeyPuckEntity.id;
		const firstPlayerGateId = this.firstPlayerGate.id;
		const secondPlayerGateId = this.secondPlayerGate.id;
		const topFieldBorderId = this.topFieldBorder.id;
		const bottomFieldBorderId = this.bottomFieldBorder.id;
		// const leftFieldBorderId = this.leftFieldBorder.id;
		// const rightFieldBorderId = this.rightFieldBorder.id;
		// const middleFieldBorderId = this.middleFieldBorder.id;

		Matter.Events.on(engine, 'collisionStart', event => {
			event.pairs.forEach(({bodyA, bodyB}) => {
				const bodyAId = bodyA.id;
				const bodyBId = bodyB.id;

				//hockey puck collisions
				//hockey puck and first player gate collision
				if ((bodyAId === hockeyPuckEntityId && bodyBId === firstPlayerGateId)
					||(bodyBId === hockeyPuckEntityId && bodyAId === firstPlayerGateId)) {
						console.log('collision between hockey puck and first player gate');
						this.handleFirstPlayerGateHit();
				} else
				//hockey puck and second player gate collision
				if ((bodyAId === hockeyPuckEntityId && bodyBId === secondPlayerGateId)
					||(bodyBId === hockeyPuckEntityId && bodyAId === secondPlayerGateId)) {
						console.log('collision between hockey puck and second player gate');
						//handle it here. create a function
						this.handleSecondPlayerGateHit();
				} else
				//hockey puck and a player collision
				if ((bodyAId === hockeyPuckEntityId && (bodyBId === firstPlayerEntityId || bodyBId === secondPlayerEntityId))
					||(bodyBId === hockeyPuckEntityId && (bodyAId === firstPlayerEntityId || bodyAId === secondPlayerEntityId))) {
						console.log('collision between a player and hockey puck');
						const didCollideWithFirstPlayer = bodyAId === firstPlayerEntityId || bodyBId === firstPlayerEntityId;
						const hockeyPuckAndPlayerAngle = Matter.Vector.angle(
							this.hockeyPuckEntity.position,
							didCollideWithFirstPlayer
							? this.firstPlayerEntity.position
							: this.secondPlayerEntity.position
						);
						const forceModifier = 10;
						Matter.Body.setVelocity(
							this.hockeyPuckEntity,
							{
								x: -Math.cos(hockeyPuckAndPlayerAngle) * forceModifier,
								y: -Math.sin(hockeyPuckAndPlayerAngle) * forceModifier,
							}
						);
						Matter.Body.setVelocity(
							didCollideWithFirstPlayer ? this.firstPlayerEntity : this.secondPlayerEntity,
							{
								x: Math.cos(hockeyPuckAndPlayerAngle) * forceModifier,
								y: Math.sin(hockeyPuckAndPlayerAngle) * forceModifier,
							}
						);
				} else
				//hockey puck and a vertical field border collision
				if ((bodyAId === hockeyPuckEntityId && (bodyBId === topFieldBorderId || bodyBId === bottomFieldBorderId))
					||(bodyBId === hockeyPuckEntityId && (bodyAId === topFieldBorderId || bodyAId === bottomFieldBorderId))) {
						const didHitTopFieldBorder = this.hockeyPuckEntity.position.y < playFieldHeight / 2;
						const didHitBottomFieldBorder = this.hockeyPuckEntity.position.y > playFieldHeight / 2;
						if (didHitTopFieldBorder) console.log('collision between hockey puck and top field border');
						else if (didHitBottomFieldBorder) console.log('collision between hockey puck and bottom field border');
						const hockeyPuckAndVerticalFieldBorderAngle = Matter.Vector.angle(
							this.hockeyPuckEntity.position,
							didHitTopFieldBorder
							? this.topFieldBorder.position
							: this.bottomFieldBorder.position
						);
						let forceModifier = getRandomIntInclusive(7, 12);
						Matter.Body.setVelocity(
							this.hockeyPuckEntity,
							{
								x: Math.cos(hockeyPuckAndVerticalFieldBorderAngle) * forceModifier,
								y: -Math.sin(hockeyPuckAndVerticalFieldBorderAngle) * forceModifier,
							}
						);
				}
				// else
				// //hockey puck and a horizontal field border collision
				// if ((bodyAId === hockeyPuckEntityId && (bodyBId === leftFieldBorderId || bodyBId === rightFieldBorderId))
				// 	||(bodyBId === hockeyPuckEntityId && (bodyAId === leftFieldBorderId || bodyAId === rightFieldBorderId))) {
				// 		const didHitLeftFieldBorder = this.hockeyPuckEntity.position.x < playFieldWidth / 2;
				// 		const didHitRightFieldBorder = this.hockeyPuckEntity.position.x > playFieldWidth / 2;
				// 		if (didHitLeftFieldBorder) console.log('collision between hockey puck and left field border');
				// 		else if (didHitRightFieldBorder) console.log('collision between hockey puck and right field border');
				// }
				// else
				// //player (bot) and a vertical field border collision
				// if ((bodyAId === secondPlayerEntityId && (bodyBId === topFieldBorderId || bodyBId === bottomFieldBorderId))
				// 	||(bodyBId === secondPlayerEntityId && (bodyAId === topFieldBorderId || bodyAId === bottomFieldBorderId))) {
				// 		const didHitTopFieldBorder = this.secondPlayerEntity.position.y < playFieldHeight / 2;
				// 		const didHitBottomFieldBorder = this.secondPlayerEntity.position.y > playFieldHeight / 2;
				// 		if (didHitTopFieldBorder) console.log('collision between second player (BOT) and top field border');
				// 		else if (didHitBottomFieldBorder) console.log('collision between second player (BOT) and bottom field border');
				// }
				// else
				// //player (bot) and a horizontal field border collision
				// if ((bodyAId === secondPlayerEntityId && (bodyBId === leftFieldBorderId || bodyBId === rightFieldBorderId))
				// 	||(bodyBId === secondPlayerEntityId && (bodyAId === leftFieldBorderId || bodyAId === rightFieldBorderId))) {
				// 		const didHitLeftFieldBorder = this.secondPlayerEntity.position.x < playFieldWidth / 2;
				// 		const didHitRightFieldBorder = this.secondPlayerEntity.position.x > playFieldWidth / 2;
				// 		if (didHitLeftFieldBorder) console.log('collision between second player (BOT) and left field border');
				// 		else if (didHitRightFieldBorder) console.log('collision between second player (BOT) and right field border');
				// };
			});
		});


		return {
			physics: {engine: engine, world: world},
			topFieldBorder: {
				body: this.topFieldBorder,
				size: [playFieldWidth, verticalWallsHeight],
				renderer: Wall,
			},
			bottomFieldBorder: {
				body: this.bottomFieldBorder,
				size: [playFieldWidth, verticalWallsHeight],
				renderer: Wall,
			},
			leftFieldBorder: {
				body: this.leftFieldBorder,
				size: [horizontalWallsWidth, windowHeight], //playFieldHeight
				renderer: Wall,
			},
			rightFieldBorder: {
				body: this.rightFieldBorder,
				size: [horizontalWallsWidth, windowHeight], //playFieldHeight
				renderer: Wall,
			},
			middleFieldBorder: {
				body: this.middleFieldBorder,
				size: [playFieldWidth, verticalWallsHeight],
				renderer: Wall,
			},
			firstPlayerGate: {
				body: this.firstPlayerGate,
				size: [fieldGateWidth, fieldGateHeight],
				name: 'firstPlayerGate',
				renderer: FieldGate,
			},
			secondPlayerGate: {
				body: this.secondPlayerGate,
				size: [fieldGateWidth, fieldGateHeight],
				name: 'secondPlayerGate',
				renderer: FieldGate,
			},

			firstPlayer: {
				body: this.firstPlayerEntity,
				size: [playerEntityRadius, playerEntityRadius],
				name: 'firstPlayer',
				renderer: PlayerStick,
			},
			secondPlayer: {
				body: this.secondPlayerEntity,
				size: [playerEntityRadius, playerEntityRadius],
				name: 'secondPlayer',
				renderer: PlayerStick,
			},
			hockeyPuck: {
				body: this.hockeyPuckEntity,
				radius: hockeyPuckRadius,
				renderer: HockeyPuck,
			},
		}
	};

	render() {
		const {
			firstPlayerScore,
			secondPlayerScore,
			running,
			pause,
		} = this.state;

		return (
			<View style={styles.wrap}>
				<View style={styles.interfaceWrap}>
					<View style={styles.scoreIndicator}>
						<Text
							style={[
								styles.scoreIndicatorPlayerName,
								{color: firstPlayerColor}
							]}
						>
							Красный
						</Text>
						<Text style={styles.scoreIndicatorNumber}>
							{firstPlayerScore}
						</Text>
					</View>
					<TouchableOpacity onPress={this.setPause}
						style={styles.pauseButtonWrap}
					>
						<Image
							source={pauseIcon}
							style={{
								width: '130%',
								height: '130%',
							}}
						/>
					</TouchableOpacity>
					<View style={styles.scoreIndicator}>
						<Text
							style={[
								styles.scoreIndicatorPlayerName,
								{color: secondPlayerColor}
							]}
						>
							Синий
						</Text>
						<Text style={styles.scoreIndicatorNumber}>
							{secondPlayerScore}
						</Text>
					</View>
				</View>
				<ImageBackground
					source={fieldBg}
					style={styles.fieldContainer}
				>
					<StatusBar hidden={true} />
						<GameEngine
							ref={(ref) => (this.gameEngine = ref)}
							style={styles.gameContainer}
							onEvent={this._onEvent}
							running={running}
							systems={[Physics, this.playersMovement]}
							entities={this.entities}
						/>
					<Modal
						animationType='fade'
						transparent
						visible={!running}
					>
						<Overlay
							setGameMode={this.setGameMode}
							resume={this.resume}
							isPause={pause}
						/>
					</Modal>
				</ImageBackground>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	wrap: {
		flex: 1,
		backgroundColor: mainBgColor,
	},
	interfaceWrap: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: windowWidth,
		paddingTop: 15,
		paddingHorizontal: 32,
	},
	scoreIndicator: {
		alignItems: 'center',
		minWidth: 100,
	},
	scoreIndicatorPlayerName: {
		fontWeight: 'bold',
		fontSize: 18,
	},
	scoreIndicatorNumber: {
		fontWeight: 'bold',
		color: mainTextColor,
		fontSize: 20,
	},
	pauseButtonWrap: {
		borderWidth: 2,
		borderColor: 'orange',
		width: 64,
		height: 64,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 32,
	},

	fieldContainer: {
		width: playFieldWidth,
		height: playFieldHeight,
		position: 'absolute',
		bottom: bottomFieldOffset,
		top: topFieldOffset,
		left: sideFieldOffset,
		right: sideFieldOffset,
	},
	gameContainer: {
		borderWidth: 1,
		borderColor: '#7342FF',
	},
});
