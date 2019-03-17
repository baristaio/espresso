const amqpConnector = require('../clients/rabbit-client');
const mongoConnector = require('../clients/mongodb-client');
const mysqlConnector = require('../clients/mysql-client');
const socketConnector = require('../clients/sockets');

const SERVICES = {
  'mysql': mysqlConnector,
  'mongodb': mongoConnector,
  'amqp': amqpConnector,
  'socket': socketConnector
};

const mount = async(logger, connectionDescriptor, app) => {
  logger.info(`Create connection ${connectionDescriptor.name} for ${connectionDescriptor.type}`);
  const service = SERVICES[connectionDescriptor.type];
  if (!service) {
    throw new Error(` Server ${connectionDescriptor.type} does not exist`);
  }
  return service.connect(logger, connectionDescriptor.descriptor, app);
};

module.exports = {
  mount
};
