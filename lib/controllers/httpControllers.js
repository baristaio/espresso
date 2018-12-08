const controllers = require('./controllers');

const createModel = async(logger, connection, req) => {
  const eventModel = req.body;
  validateBoxModel(eventModel);
  const model = await controllers.upsert(logger, connection, eventModel);
  return {
    body: eventModel
  };
};

const enrich = async(logger, connection, req) => {
  logger.info('Enrich model request');
  const eventModel = req.body.model;
  validateBoxModel(eventModel);
  const model = await controllers.enrich(logger, connection, eventModel);
  return {
    body: eventModel
  };
};

function validateBoxModel(boxesModel) {
  console.log(boxesModel);
  return true;
}

const find = async(logger, connection, req) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    const eventModel = await controllers.find(logger, connection, eventId);
    return {
      body: eventModel
    };
  }
  catch (err) {
    logger.error(err);
    return {
      status: 400,
      body: err.toLocaleString()
    };
  }
};

const findEvent = async(logger, connection, req) => {
  logger.info('request to find event boxes');
  return { action: 'findEvent' };
};

const findByNameAndView = async(logger, connection, req) => {
  logger.info('request to find view for the event');
  return { action: 'findByNameAndView' };
};

const deleteByName = async(logger, connection, req) => {
  return { action: 'deleteByName' };
};

const recalculateBoxes = async(logger, connection, req) => {
  const payload = req.body;
  payload.name = req.params.id;
  return controllers.recalculateBoxes(payload, {
    logger, connection, queueName: subscribers.api[0].pubQueue.queue});
};

const runMigration = async(logger, connection, req) => {
  return controllers.runMigration(logger, connection);
};

const health = async(logger, connection, req) => {
  try {
    return {
      status: 200,
      body: controllers.health(logger, connection)
    };
  }
  catch (err) {
    return {
      status: 500,
      body: err.toString()
    };
  }
};

module.exports = {
  health,
  createModel,
  enrich,
  find,
  findEvent,
  findByNameAndView,
  deleteByName,
  recalculateBoxes,
  runMigration
};
