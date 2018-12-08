const amqpConnector = require('./rabbit-client');
const makeController = require('../controller').makeController;
const mongoConnector = require('./mongodb-client');
const mysqlConnector = require('./mysql-client');
const makeSubscribers = require('../subscribers').makeSubscribers;
const cors = require('cors');

function getConnections(logger, descriptor) {
  return new Promise((resolve, reject) => {

    if (!descriptor) {
      resolve([]);
    }

    const promises = [];
    const connectionTypes = Object.keys(descriptor);
    connectionTypes.forEach(async type => {
      const info = descriptor[type];
      switch (type) {
      case 'mysql':
        promises.push(mysqlConnector.connect(logger, info).then(connection => ({'mysql': connection})));
        break;
      case 'mongodb':
        promises.push(mongoConnector.connect(logger, info).then(connection => ({'mongodb': connection})));
        break;
      case 'amqp':
        promises.push(amqpConnector.connect(logger, info).then(connection => ({'amqp': connection})));
        break;
      }
    });
    Promise.all(promises).then(connections => {
      // transform array of object to dictionary
      resolve(connections.reduce((all, connector) => Object.assign({}, all, connector), {}));
    });
  });
}

const getService = (serviceDescriptor, logLevel = 'info') => {
  let _cache = {};
  const service = this;

  const descriptor = Object.assign({}, serviceDescriptor);
  const logger = require('../logger').logger({
    name: descriptor.name,
    level: logLevel
  });

  const appServer = require('./espresso-express');
  const bodyParser = require('body-parser');
  const expressLog = require('../logger').expressLogger();

  let server;

  const app = appServer();
  const start = async() => {
    const utils = require('./utils');

    return new Promise(async(resolve, reject) => {
      try {
        const connections = await getConnections(logger, serviceDescriptor.connections);
        let bodyLimit = (serviceDescriptor.bodyLimit || '15') * 1;
        if (isNaN(bodyLimit)) {
          bodyLimit = 1;
        }
        const limit = utils.translateSize(bodyLimit);

        app.use(expressLog);
        app.use(cors);
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json({limit: limit.human}));
        app.use(bodyParser.urlencoded({
          limit: limit.human,
          extended: true,
          parameterLimit: limit.number
        }));

        // app.get('/service-name', (req, res) => res.status(200).json({ service: descriptor.name }));
        if (serviceDescriptor.onStart) {
          const onStartData = await serviceDescriptor.onStart(logger, connections);
          _cache = Object.assign({}, onStartData, _cache);
        }
        descriptor.routes.forEach(route => {
          app[route.method.toLowerCase()](route.route, makeController(logger, connections, route));
        });

        // initiate AMQP subscribers
        descriptor.subscribers.forEach(pubsub => {
          makeSubscribers(logger, connections, pubsub);
        });

        server = await app.listen(descriptor.port, () => {
          logger.info('listening port:', descriptor.port);
        });

        resolve(service);
      }
      catch (err) {
        console.error(err);
        logger.error(err);
        reject(err);
      }
    });
  };

  const stop = (reason) => {
    logger.info('Service %s will be stopped ', descriptor.name, reason);
    server.close();
    logger.info('Service %s stopped ', descriptor.name, reason);
  };

  return {
    cache: () => _cache,
    start,
    stop
  };
};

module.exports = {
  getService
};
