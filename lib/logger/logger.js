
const bunyan = require('bunyan');
const expressLogger = require('express-bunyan-logger');

// the minimum standard definitions
const std = {
  name: 'espresso'
};

const logger = (params = std) => bunyan.createLogger(params);
logger.trace('default std logger', std);

exports = module.exports = logger;
module.exports = {
  logger,
  expressLogger
};
