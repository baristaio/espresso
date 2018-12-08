
const viewModelProcessor = require('./viewModelProcessor');

const actionsMap = {
  'update': async(connection, payload, logger) => viewModelProcessor.update(logger, connection, payload),
  'create': async(connection, payload, logger) => viewModelProcessor.create(logger, connection, payload),
  'enrich': async(connection, payload, logger) => viewModelProcessor.enrich(logger, connection, payload),
  'delete': async(connection, payload, logger) => viewModelProcessor.deleteByName(logger, connection, payload)
};

// === IMPLEMENTATION ===
async function doAction(message, { logger, connections }) {
  // logger.info(`Proceed ${message}`);
  console.log('AMQP msg received');
  return new Promise((resolve, reject) => {
    try {
      const { action, payload } = validate(logger, message);
      console.log(`AMQP do action ${action}`);
      const doIt = actionsMap[action];
      if (!doIt) {
        reject(new Error(`The '${action}' does not exists.`));
      }
      doIt(connections, payload, logger)
        .then(result => {
          // console.log(`AMQP action responded ${JSON.stringify(result)}`);
          const response = {
            message: {
              action,
              payload
            }
          };
          if (action !== 'create' && action !== 'update') {
            return resolve(response);
          }
          response.doPublish = true;
          // fetch model names to be sent to vehicle modeller
          viewModelProcessor.fetchModelNames(payload.name, logger).then(model_names => {
            if (model_names && model_names.length) {
              response.message.payload.model_names = model_names;
            }
            console.log('AMQP msg response with option doPublish true');
            return resolve(response);
          });
        });
    }
    catch (err) {
      reject(err);
    }
  });
}

function validate(logger, message) {
  try {
    let params = JSON.parse(message);
    if (typeof(params) === 'string') {
      params = JSON.parse(params);
    }

    if (typeof params.action !== 'undefined') {
      return Object.assign({}, params, { payload: params.payload});
    }
    return new Error('Action type was not defined.');
  }
  catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Invalid message format. It must be a JSON string.');
  }
}

module.exports = {
  doAction,
  validate
};
