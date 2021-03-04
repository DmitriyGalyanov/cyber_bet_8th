import {ENTITY_LIST, ENTITY_DETAILS} from '../constants';
import {Entity} from '../renderers';
import {addEntity} from '../physicsHelpers';


const Generator = (entities) => {
  const engine = entities.physics.engine

  ENTITY_LIST.forEach((entityType) => {
    addEntity(
      engine,
      entities,
      entityType,
      Entity,
      ENTITY_DETAILS[entityType].probability,
    )
  })

  return entities
}

export default Generator
