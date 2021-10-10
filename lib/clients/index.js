const amqpConnector = require('../clients/rabbit-client');
const mysqlConnector = require('../clients/mysql-client');
const socketConnector = require('../clients/sockets');
const redisClient = require('../clients/redis-client');

const SERVICES = {
  'mysql': mysqlConnector,
  'amqp': amqpConnector,
  'socket': socketConnector,
  'redis': redisClient
};

const mountConnection = async(logger, connectionDescriptor) => {
  logger.info(`Create connection ${connectionDescriptor.name} for ${connectionDescriptor.type}`);
  const service = SERVICES[connectionDescriptor.type];
  if (!service) {
    throw new Error(` Server ${connectionDescriptor.type} does not exist`);
  }
  return service.connect(logger, connectionDescriptor.descriptor);
};

function mount(logger, connectionsDescriptor) {
  return new Promise((resolve) => {
    if (!connectionsDescriptor) {
      resolve([]);
    }

    const promises = [];
    connectionsDescriptor.forEach(descriptor => {
      promises.push(mountConnection(logger, descriptor).then(connection => ({
        [descriptor.name]: connection
      })));
    });

    Promise.all(promises).then(connections => {
      // transform array of object to dictionary
      resolve(connections.reduce((all, connector) => Object.assign({}, all, connector), {}));
    });
  });
}

// jYpggHfQx9sZY/9

module.exports = {
  mount
};
