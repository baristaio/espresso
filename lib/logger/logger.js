const bunyan = require('bunyan');
const expressLogger = require('express-bunyan-logger');


//TODO: implement logger instances
/**
 *  @param name: service name
 *  @param pId: process Id
 *  @param level: log level
 *  @param etc ... other relevant parameters like a transport, log le
 * @type {Logger}
 */
function foo() {

}

const logger =  (params) => bunyan.createLogger(params);
exports = module.exports = logger;
module.exports = {
    logger,
    expressLogger
};