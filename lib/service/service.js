const mountController = require('../controller').mountController;
const mountSubscribers = require('../subscribers').mount;
const mountConnections = require('../clients').mount;
const { v4: uuidv4 } = require('uuid');

const bodyParser = require('body-parser');
const DEFAULT_BODY_LIMIT = 15;

function getService(serviceDescriptor, logLevel = 'info') {
    let _cache = {};
    const service = this;

    const descriptor = Object.assign({}, serviceDescriptor);
    const logParams = {
        name: descriptor.name,
        level: logLevel
    };
    const logger = require('../logger').logger(logParams);

    const requestIdMiddleware = (req, res, next) => {
        req.id = uuidv4();
        next();
    };

    const appServer = require('./espresso-express');
    // const expressLog = require('../logger').expressLogger();
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

    app.use(requestIdMiddleware);

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
                // app.use(cors);
                app.use(bodyParser.urlencoded({ extended: true }));
                app.use(bodyParser.json({
                    limit: limit.text,
                    verify: (req, res, buf) => {
                        req.rawBody = buf.toString();
                    }
                }));

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
                mountRouteControllers(descriptor.routes, logParams, app, connections);

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
        // eslint-disable-next-line no-process-exit
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

function mountRouteControllers(routes, logParams, app, connections) {
    // const freeRoutes = routes.filter(route => route.free);
    // const securedRoutes = routes.filter(route => !route.free);
    // add service api routes
    routes.forEach(routeDescriptor => {
        app[routeDescriptor.method.toLowerCase()](routeDescriptor.route,
            mountController(logParams, connections, routeDescriptor));
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
