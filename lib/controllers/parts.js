const viewModel = require('../model/views');
const espressoSubscribers = require('../espresso/subscribers');
const request = require('request');
const boxesUtil = require('../utils/boxesUtil');

const create = async(payload, logger) => {
  const result = await upsert(payload);
  logger.trace(`Box model id ${payload.name} has been created`);
  return result;
};

const update = async(payload, logger) => {
  const result = await upsert(payload);
  logger.trace(`Box model id ${payload.name} has been updated`);
  return result;
};

const enrich = async(payload, logger) => {
  const result = await upsert(payload);
  logger.trace(`Box model id ${payload.name} has been enriched`);
  return result;
};

const upsert = async(payload) => {
  payload = boxesUtil.encodeBoxesModel(payload);
  return viewModel.saveModel({
    name: '' + payload.name,
    instances: [...payload.instances]
  });
};

const deleteByName = async(payload, logger) => {
  const result = await viewModel.deleteByName(payload.name);
  logger.trace(`Box model id ${payload.name} has been deleted`);
  return result;
};

const find = async(payload, logger) => {
  logger.trace(`find model ${payload.name} view ${payload.image}`);
  if (!payload.image) {
    // read model
    return new Promise((resolve, reject) => {
      viewModel.findByName(payload.name).then(model => {
        resolve(model);
      });
    });
  }

};

const findBoxesPerView = async(payload, logger) => {
  logger.trace(`find model ${payload.name} for view ${payload.image}`);
  return viewModel.findByNameAndView(payload.name, payload.image);
};

const recalculateBoxes = async(payload, {logger, connection, queueName}) => {
  logger.trace(`recalculate boxes for ${payload.name} with param model_names=${payload.model_names}`);
  // fetch current boxes model
  const boxesP = viewModel.findByName(payload.name);
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
  findBoxesPerView,
  deleteByName,
  recalculateBoxes,
  fetchModelNames
};
