import {removeEntity} from '../physicsHelpers';
import {windowWidth, windowHeight, playerImgHeight} from '../constants';


const Destroyer = (entities) => {
	Object.keys(entities).forEach((key) => {
		const entity = entities[key];
		if (entity.body) {
			const position = entity.body.position;
			// if (position.y > windowHeight - playerImgHeight / 2) {
			// 	console.log('position y:', position.y, 'player img height:', playerImgHeight)
			// }
			// Remove entities that fall out of bounds
			if (position.x < 0 || position.x > windowWidth || position.y > windowHeight) {
				removeEntity(entity.body, entities);
			}
		}
	})

	return entities;
}

export default Destroyer;
