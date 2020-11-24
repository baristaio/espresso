const amqpConnector = require('../clients/rabbit-client');
const mysqlConnector = require('../clients/mysql-client');
const socketConnector = require('../clients/sockets');
const redisClient = require('../clients/redis-client');
const twilioClient = require('../clients/twilio');

const SERVICES = {
  'mysql': mysqlConnector,
  'amqp': amqpConnector,
  'socket': socketConnector,
  'redis': redisClient,
  'twilio': twilioClient
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
