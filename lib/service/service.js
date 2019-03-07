
const mountController = require('../controller').mountController;
const mountSubscribers = require('../subscribers').mount;
const mountService = require('../clients').mount;

// const cors = require('cors');

function getConnections(logger, connectionsDescriptor) {
  return new Promise((resolve) => {

    if (!connectionsDescriptor) {
      resolve([]);
    }

    const promises = [];
    connectionsDescriptor.forEach(descriptor => {
      promises.push(mountService(logger, descriptor).then(connection => ({
        [descriptor.name]: connection
      })));
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
        // app.use(cors);
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json({limit: limit.text}));
        app.use(bodyParser.urlencoded({
          limit: limit.text,
          extended: true,
          parameterLimit: limit.number
        }));

        // app.get('/service-name', (req, res) => res.status(200).json({ service: descriptor.name }));
        if (serviceDescriptor.onStart) {
          const onStartData = await serviceDescriptor.onStart(logger, connections);
          _cache = Object.assign({}, onStartData, _cache);
        }

        // make routes
        mountRouteControllers(descriptor.routes, logger, app, connections);

        // initiate AMQP subscribers
        if (descriptor.subscribers) {
          mountQueueListener(logger, connections, descriptor.subscribers);
        }

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
    server.close(); // close connections
    logger.info('Service %s stopped ', descriptor.name, reason);
  };

  return {
    cache: () => _cache,
    start,
    stop
  };
};

function mountRouteControllers(routes, logger, app, connections) {
  // const freeRoutes = routes.filter(route => route.free);
  // const securedRoutes = routes.filter(route => !route.free);
  routes.forEach(routeDescriptor => {
    app[routeDescriptor.method.toLowerCase()](routeDescriptor.route,
      mountController(logger, connections, routeDescriptor));
  });
}

function mountQueueListener(logger, connections, subscribers) {
  subscribers.forEach(pubsub => {
    mountSubscribers(logger, connections, pubsub);
  });
}

module.exports = {
  getService
};
