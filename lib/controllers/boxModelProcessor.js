const boxModel = require('../model/dynamoBoxes');
const espressoSubscribers = require('../espresso/subscribers');
const request = require('request');
const boxesUtil = require('../utils/boxesUtil');

const create = async(payload, logger) => {
  const result = await upsert(payload);
  logger.info(`Box model id ${payload.name} has been created`);
  return result;
};

const update = async(payload, logger) => {
  const result = await upsert(payload);
  logger.info(`Box model id ${payload.name} has been updated`);
  return result;
};

const deleteByName = (payload, logger) => {
  const result = boxModel.deleteByName(payload.name);
  logger.info(`Box model id ${payload.name} has been deleted`);
  return result;
};

const find = (payload, logger) => {
  logger.info(`find model ${payload.name}`);
  return new Promise((resolve, reject) => {
    boxModel.findByName(payload.name).then(model => {
      resolve(boxesUtil.decodeBoxesModel(model.Item));
    });
  });
};

const enrich = async(payload, logger) => {
  const result = await upsert(payload);
  logger.info(`Box model id ${payload.name} has been enriched`);
  return result;
};

const upsert = (payload) => {
  payload = boxesUtil.encodeBoxesModel(payload);
  return boxModel.upsert({
    name: '' + payload.name,
    instances: [...payload.instances]
  });
};

const recalculateBoxes = (payload, {logger, connection, queueName}) => {
  logger.info(`recalculate boxes for ${payload.name} with param model_names=${payload.model_names}`);
  // fetch current boxes model
  const boxesP = boxModel.findByName(payload.name);
  boxesP.then(res => {
    const data = {
      action: 'create',
      payload: res.Item
    };
    data.payload.model_names = payload.model_names;
    // send create request to vehicle modeller
    espressoSubscribers.postToQueue(logger, connection, queueName, data);
  });
};

const fetchModelNames = (eventId, logger) => {
  logger.debug(`fetch vehicle model names by event id ${eventId}`);
  const url = `http://${process.env.SLIM_BE_ENDPOINT}/api/event_model_names/${eventId}`;
  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      let res = [];
      if (! error && response.statusCode === 200 && body && body.length) {
        res = JSON.parse(body);
      }
      logger.debug(`vehicle model names for event id ${eventId} fetched ${res}`);
      resolve(res);
    });
  });
};

module.exports = {
  create,
  update,
  enrich,
  find,
  deleteByName,
  recalculateBoxes,
  fetchModelNames
};
