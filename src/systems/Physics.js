import Matter from 'matter-js';

const Physics = (entities, {time, dispatch}) => {
  const engine = entities.physics.engine
  const timeInterval = time.delta

  Matter.Engine.update(engine, timeInterval)

  dispatch({
    // type: 'increment-day-interval',
    value: Number(timeInterval),
  })

  return entities
}

export default Physics
