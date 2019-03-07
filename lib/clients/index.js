const amqpConnector = require('../clients/rabbit-client');
const mongoConnector = require('../clients/mongodb-client');
const mysqlConnector = require('../clients/mysql-client');

const SERVICES = {
  'mysql': mysqlConnector,
  'mongodb': mongoConnector,
  'amqp': amqpConnector
};

const mount = async(logger, connectionDescriptor) => {
  logger.info(`Create connection ${connectionDescriptor.name} for ${connectionDescriptor.type}`);
  const service = SERVICES[connectionDescriptor.type];
  if (!service) {
    throw new Error(` Server ${connectionDescriptor.type} does not exist`);
  }
  return service.connect(logger, connectionDescriptor.descriptor);
};

module.exports = {
  mount
};
