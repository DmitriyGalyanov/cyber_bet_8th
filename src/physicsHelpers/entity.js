import Matter from 'matter-js';
import {ENTITY_DETAILS, itemsLimit, windowWidth} from '../constants';


/**
 * Create and add an entity to the game engine.
 * @param {Matter.Engine} engine Game engine
 * @param {any} entities Collection of all game entities
 * @param {string} entityType Entity type
 * @param {Entity} Entity Entity renderer
 * @param {number} probability If exceeded this threshold, the entity will be created
 */
const addEntity = (engine, entities, entityType, Entity, probability) => {
  if (Math.random() < probability) {
    const entityDetails = ENTITY_DETAILS[entityType]

    /**
     * entities.deleted is a pool of discarded entities.
     * Whenever possible, we should reuse this pool rather than creating new entities.
     */
    if (entities.deleted.length > 0) {
      const body = entities.deleted[0]
      entities.deleted.splice(0, 1)

      _replaceEntity(engine, entities, body, entityType, entityDetails, Entity)
    } else {
      /**
       * We enforce a limit on the number of new entities.
       */
      if (itemsLimit > Object.keys(entities).length) {
        _createEntity(engine, entities, Entity, entityDetails, {
          label: entityType,
        })
      }
    }
  }
}

/**
 * Remove the given entity.
 * @param {Matter.Body} body Entity to remove
 * @param {any} entities Collection of all game entities
 */
const removeEntity = (body, entities) => {
  if (body) {
    Matter.Composite.remove(entities.physics.world, body)
    delete entities[body.id]
    entities.deleted.push(body)
  }
}

/**
 * Get a random integer between min and max (inclusive)
 * @param {number} min Min range
 * @param {number} max Max range
 */
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * Replace the given entity with new settings
 * @param {Matter.Engine} engine Game engine
 * @param {any} entities Collection of all game entities
 * @param {any} entity Entity to be replaced. Sourced from entities.deleted pool
 * @param {string} entityType Entity type
 * @param {any} entityDetails Static config for entity
 * @param {Entity} renderer Entiity renderer (see renderer directory)
 */
const _replaceEntity = (
  engine,
  entities,
  entity,
  entityType,
  entityDetails,
  renderer,
) => {
  const widthOffset = Math.floor(entityDetails.width / 2)

  // Reset the entity settings
  Matter.Body.set(entity, {
    id: Matter.Common.nextId(),
    position: {
      x: getRandomInt(widthOffset, windowWidth - widthOffset),
      y: 0,
    },
    velocity: {
      x: 0,
      y: 0,
    },
    label: entityType,
  })

  _addEntityToGameEngine(engine, entities, entity, entityDetails, renderer)
}

/**
 * Create an entity and add to game engine
 * @param {Matter.Engine} engine Game engine
 * @param {any} entities Collection of all game entities
 * @param {Entity} renderer Entiity renderer (see renderer directory)
 * @param {any} entityDetails Static config for entity
 * @param {any} options Options for Matter.Bodies creation
 */
const _createEntity = (
  engine,
  entities,
  renderer,
  entityDetails,
  options = {},
) => {
  const widthOffset = Math.floor(entityDetails.width / 2)
  const entity = Matter.Bodies.rectangle(
    getRandomInt(widthOffset, windowWidth - widthOffset), // Always start at the top of screen with random x-value
    0,
    entityDetails.width,
    entityDetails.height,
    options,
  )

  _addEntityToGameEngine(engine, entities, entity, entityDetails, renderer)
}

/**
 * Perform the actual action to add the entity to game engine
 * @param {Matter.Engine} engine Game engine
 * @param {any} entities Collection of all game entities
 * @param {any} entity Entity
 * @param {any} entityDetails Static config for entity
 * @param {Entity} renderer Entiity renderer (see renderer directory)
 */
const _addEntityToGameEngine = (
  engine,
  entities,
  entity,
  entityDetails,
  renderer,
) => {
  Matter.World.add(engine.world, entity)

  entities[entity.id] = {
    body: entity,
    size: [entityDetails.width, entityDetails.height],
    name: entityDetails.name,
    color: entityDetails.color,
    renderer: renderer,
  }
}

module.exports = {
  addEntity,
  removeEntity,
  getRandomInt,
}
