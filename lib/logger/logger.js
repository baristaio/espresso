
const bunyan = require('bunyan');
// the minimum standard definitions
const std = {
    name: 'espresso'
};

const logger = (params = std) => bunyan.createLogger(params);

exports = module.exports = logger;
module.exports = {
    logger
};
