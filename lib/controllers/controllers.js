
const partsDetection = require('../model/partsDetection');

const { boxesModel, checkHealth } = require('../model');

const utils = require('../utils/boxesUtil');
const migrations = require('../migrations');

// === ROUTES ====
const health = (logger, connections) => {
  return new Promise((resolve) => resolve(checkHealth()));
};

const upsert = async(logger, connection, model) => {
  const server = require('../service');
  const cache = server.getInstance().cache();
  validateBoxModel(model);
  logger.trace('Upsert model:', model);
  boxesModel.upsert(logger, connection, model, {
    partLocations: cache.partLocations,
    partNames: cache.partNames,
    sourceTypes: cache.sourceTypes,
    carModels: cache.carModels,
    modelTypes: cache.modelTypes
  });
};

const enrich = async(logger, connection, model) => {
  await upsert(logger, connection, model);
  partsDetection.forward(logger, connection, {
    name: model['name']
  });
};

function validateBoxModel(boxesModel) {
  return true;
}

// -----------------------
const find = async(logger, connection, eventId) => boxesModel.getEventData(logger, connection, eventId);

const findEvent = async(logger, connection, eventId) => {
  // return viewModelProcessor.find({
  //   name: req.params.id
  // }, logger);
};

const findByName = async(logger, connection, req) => {
  // return viewModelProcessor.find({
  //   name: req.params.id
  // }, logger);
};

const findByNameAndView = async(logger, connection, req) => {
  // return viewModelProcessor.findBoxesPerView({
  //   name: req.params.id,
  //   image: req.params.image
  // }, logger);
};

const deleteByName = async(logger, connection, req) => {
  // return viewModelProcessor.deleteByName({
  //   name: req.params.id
  // }, logger);
};

const recalculateBoxes = async(logger, connection, req) => {
  const payload = req.body;
  payload.name = req.params.id;
  // return viewModelProcessor.recalculateBoxes(payload, {
  //   logger, connection, queueName: subscribers.api[0].pubQueue.queue});
};

const runMigration = (logger, connection) => {
  const server = require('../service');
  const cache = server.getInstance().cache();

  return new Promise((resolve) => {
    migrations.runLatestMigration(logger, connection, cache);
    resolve('started');
  });
};

const onStart = async(logger, connection) => {
  logger.info('On START');
  const partsDAO = require('../model/dao/partsDAO');
  const partLocations = await partsDAO.findAllPartLocation(logger, connection);
  const partNames = await partsDAO.findAllParts(logger, connection);
  const sourceType = await partsDAO.findAllSourceTypes(logger, connection);
  const carModel = await partsDAO.findAllCarModels(logger, connection);
  const modelTypes = await partsDAO.findAllModels(logger, connection);

  const partsMap = partNames.reduce((total, item)=> {
    total = Object.assign({}, {
      [item.part_name]: item.partid,
      [item.partid]: item.part_name
    }, total);
    return total;
  }, {});

  const partLocationsMap = partLocations.reduce((total, item)=> {
    total = Object.assign({}, {
      [item.location_name]: item.locationid,
      [item.locationid]: item.location_name
    }, total);
    return total;
  }, {});

  const sourceTypeMap = sourceType.reduce((total, item)=> {
    total = Object.assign({}, {
      [item.source_name]: item.sourceid,
      [item.sourceid]: item.source_name
    }, total);
    return total;
  }, {});

  const carModelsMap = carModel.reduce((total, item)=> {
    total = Object.assign({}, {
      [item.model_name]: item.modelid,
      [item.modelid]: item.model_name
    }, total);
    return total;
  }, {});

  const modelTypesMap = modelTypes.reduce((total, item)=> {
    total = Object.assign({}, {
      [item.model_name]: item.modelid,
      [item.modelid]: item.model_name
    }, total);
    return total;
  }, {});

  return {
    partNames: partsMap,
    partLocations: partLocationsMap,
    sourceTypes: sourceTypeMap,
    carModels: carModelsMap,
    modelTypes: modelTypesMap
  };
};

module.exports = {
  enrich,
  onStart,
  upsert,
  findEvent,
  find,
  findByNameAndView,
  health,
  deleteByName,
  recalculateBoxes,
  runMigration
};
