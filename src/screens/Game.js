import React, {PureComponent} from 'react';
import {
	ImageBackground,
	StatusBar,
	StyleSheet,
	Text,
	View,
} from 'react-native';

import Matter from 'matter-js';
import {GameEngine} from 'react-native-game-engine';

import {Monkey} from '../renderers';
import {Physics, Generator, Destroyer} from '../systems';
import {removeEntity} from '../physicsHelpers';
import {CircleButton} from '../components';
import GameOverScreen from './GameOverOverlay';
import PauseOverlay from './PauseOverlay';

import {
	INITIAL_GRAVITY,
	contrastColor,
	PLAYER_X_START,
	PLAYER_Y_FIXED,
	startingScore,
	playerImgWidth,
	playerPhysicalWidth,
	playerImgHeight,
	PLAYER_WIDTH_OFFSET,
	windowWidth,
	windowHeight,
	ENTITY_DETAILS,
} from '../constants';

import images from '../../assets/images';
import background from '../../assets/images/background.jpg';


export class Game extends PureComponent {
	constructor(props) {
		super(props)
		this.state = {
			running: true,
			pause: false,
			// Initial game states
			score: startingScore,
			x: PLAYER_X_START,
			y: PLAYER_Y_FIXED,
		}

		this.gameEngine = null;
		this.entities = this._setupWorld();
	}
	
	monkeyMovement = (entities, { touches }) => {
		touches.filter(touch => touch.type === "move").forEach(touch => {
			let monkey = entities.player;
			const monkeyPrevPositionX = monkey.body.position.x;
	
			if (monkey && monkeyPrevPositionX) {
				let newMonkeyPositionX = monkeyPrevPositionX + touch.delta.pageX;
				if (newMonkeyPositionX > windowWidth - PLAYER_WIDTH_OFFSET) {
					newMonkeyPositionX = windowWidth - PLAYER_WIDTH_OFFSET;
				}
				if (newMonkeyPositionX <= PLAYER_WIDTH_OFFSET) {
					newMonkeyPositionX = PLAYER_WIDTH_OFFSET;
				}
				Matter.Body.setPosition(this.playerBox, {
					x: newMonkeyPositionX,
					y: PLAYER_Y_FIXED,
				});
			}
		});
	
		return entities;
	};

  _setupWorld = () => {
    const engine = Matter.Engine.create({enableSleeping: false});
    const world = engine.world;
    world.gravity.y = INITIAL_GRAVITY;

    // Player entity
    this.playerBox = Matter.Bodies.rectangle(
      PLAYER_X_START,
      PLAYER_Y_FIXED,
			playerPhysicalWidth,
      playerImgHeight,
      {isStatic: true, label: 'player'},
    );

    Matter.World.add(world, this.playerBox);

    const playerEntity = this.playerBox.id;

    // Collision event handling
    Matter.Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach(({bodyA, bodyB}) => {
        const a = bodyA.id;
        const b = bodyB.id;
        let bodyToRemove = null;
        let entityType = '';

        // Only interested in collision between player and other entities
        if (a !== playerEntity && b === playerEntity) {
          bodyToRemove = bodyA;
          entityType = bodyA.label;
        }
        if (b !== playerEntity && a === playerEntity) {
          bodyToRemove = bodyB;
          entityType = bodyB.label;
        }

        if (bodyToRemove) {
          // Remove the entity that collides with player
          removeEntity(bodyToRemove, this.entities);

          // Handle the collision effect
          if (this.gameEngine) {
            this.gameEngine.dispatch({
              type: 'entity-collision',
              entityType: entityType,
              xPos: bodyToRemove.position.x,
            })
          }
        }
      })
    })

    return {
      physics: {engine: engine, world: world},
      player: {
        body: this.playerBox,
				size: [playerImgWidth, playerImgHeight],
				renderer: Monkey,
      },
      deleted: [],
    }
  };

  // Game mechanics happen here
  _onEvent = (e) => {
    switch (e.type) {
      case 'entity-collision':
        this._handleEntityCollision(e.entityType, e.xPos);
        break;
    }
  };

  _handleEntityCollision = (entityType) => {
		const entityDetails = ENTITY_DETAILS[entityType]
		if (entityDetails.name === 'spike') {
			this._gameOver();
		}

		// Calculate the effects of the entity
		this.setState((prevState) => ({
			score: prevState.score + entityDetails.score,
		}))
	};
	
	setPause = () => {
		this.setState({running: false, pause: true});
	};
	removePause = () => {
		this.setState({running: true, pause: false});
	};

  /**
   * Remove all non-player entities and prepare for a new game
   */
  _resetEntities = () => {
    Object.keys(this.entities).forEach((key) => {
      if (key !== 'physics' && key !== 'player' && key !== 'deleted') {
        Matter.Composite.remove(
          this.entities.physics.world,
          this.entities[key].body,
        )
        delete this.entities[key];
      }
    })

    this.entities.deleted = [];
  };

  _gameOver = () => {
    this.setState({
      running: false,
    });
  };

	_reset = () => {
		this._resetEntities();
		this.setState({
			running: true,
			pause: false,
			// Initial game states
			score: startingScore,
			x: PLAYER_X_START,
			y: PLAYER_Y_FIXED,
		});
	};

	render() {
		const {score, running, pause} = this.state;

		return (
			<ImageBackground
				source={background}
				style={styles.container}
			>
				<StatusBar hidden={true} />
				<View style={styles.container}>
					<View style={styles.topContainer}>
						<View style={styles.statRow}>
							<View style={{flex: 3}}>
								<View style={styles.scoreContainer}>
									<Text style={[styles.score, {color: contrastColor}]}>
										{score}
									</Text>
                </View>
              </View>
							{!pause && running && (
								<CircleButton
									image={images.pause}
									onPress={this.setPause}
									borderStyle={styles.settingsBtnBorder}
									iconStyle={styles.settingsBtnIcon}
								/>
							)}
						</View>
					</View>
					<GameEngine
            ref={(ref) => (this.gameEngine = ref)}
						style={styles.gameContainer}
						onEvent={this._onEvent}
						running={running}
						systems={[Physics, Generator, Destroyer, this.monkeyMovement]}
						entities={this.entities}
					/>
					{!running && pause && (
						<PauseOverlay onPress={this.removePause} />
					)}
					{!running && !pause && (
						<GameOverScreen score={score} reset={this._reset} />
					)}
				</View>
			</ImageBackground>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	gameContainer: {
		position: 'absolute',
		top: windowHeight * 0.2,
		bottom: 0,
		left: 0,
		right: 0,
	},
	topContainer: {
		flexDirection: 'column',
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
	},
	statRow: {
		flex: 0.9,
		flexDirection: 'row',
	},
	scoreContainer: {
		alignSelf: 'center',
		flexDirection: 'row',
		marginTop: 10,
	},
	score: {
		textAlign: 'center',
		fontSize: 24,
		fontWeight: 'bold',
	},
	settingsBtnBorder: {
		top: 10,
		height: 50,
		width: 50,
		zIndex: 2,
		marginRight: 10,
	},
	settingsBtnIcon: {
		width: 50,
		height: 50,
		tintColor: contrastColor,
	},
});
