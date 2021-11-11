const mountController = require('../controller').mountController;
const mountSubscribers = require('../subscribers').mount;
const mountConnections = require('../clients').mount;

const DEFAULT_BODY_LIMIT = 15;

function getService(serviceDescriptor, logLevel = 'info') {
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
  const compression = require('compression');
  const cors = require('cors');

  const app = appServer();
  app.use(appServer.static(__dirname));
  let server;

  const CORS_ENABLE = {
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    'preflightContinue': false,
    'allowedHeaders': [
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'],
    'optionsSuccessStatus': 204
  };

  app.use(cors(CORS_ENABLE));
  // app.options('*', cors());
  app.use(compression());

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
  });

  const start = () => {
    const utils = require('./utils');

    return new Promise(async(resolve, reject) => {
      try {
        const connections = await mountConnections(logger, serviceDescriptor.connections);
        this.connections = connections;
        let bodyLimit = (serviceDescriptor.bodyLimit || DEFAULT_BODY_LIMIT) * 1;
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

        const xmlSettings = (serviceDescriptor.bodyParser && serviceDescriptor.bodyParser.xml) ?
          serviceDescriptor.bodyParser.xml : null;

        if (xmlSettings) {
          require('body-parser-xml')(bodyParser);
          app.use(bodyParser.xml(xmlSettings.options));
        }

        app.get('/service-name', (req, res) => res.status(200).json({ service: descriptor.name }));
        app.get('/config', (req, res) => res.status(200).json(descriptor));

        if (serviceDescriptor.hasOwnProperty('onStart')) {
          const onStartData = await serviceDescriptor.onStart(logger, connections);
          _cache = Object.assign({}, onStartData, _cache);
        }

        // make routes
        mountRouteControllers(descriptor.routes, logLevel, app, connections);

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

  const config = () => descriptor;

  const stop = (reason) => {
    logger.info('Service %s will be stopped ', descriptor.name, reason);
    server.close(); // close connections
    logger.info('Service %s stopped ', descriptor.name, reason);
    process.exit(0);
  };

  return {
    cache: () => _cache,
    logger,
    connections: () => this.connections,
    config,
    start,
    stop,
    restart: () => ({status: 'restarted'})
  };
}

function mountRouteControllers(routes, logLevel, app, connections) {
  // const freeRoutes = routes.filter(route => route.free);
  // const securedRoutes = routes.filter(route => !route.free);
  // add service api routes

  routes.forEach(routeDescriptor => {
    app[routeDescriptor.method.toLowerCase()](routeDescriptor.route,
      mountController(logLevel, connections, routeDescriptor));
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
