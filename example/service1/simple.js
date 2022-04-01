const espresso = require('../../lib/index');
const controller = require('./simple.ctrl');
const redis = require('../../lib/clients/redis-client');

const routes = [
  {
    headers: { 'Content-Type': 'application/json' },
    route: '/hello',
    method: 'get',
    controller: controller.sayHelloController
  },
  {
    headers: { 'Content-Type': 'application/json' },
    route: '/world',
    method: 'get',
    controller: controller.helloWorldController
  },
  {
    headers: { 'Content-Type': 'application/json' },
    route: '/redis',
    method: 'get',
    controller: controller.redisTest
  }
];

const localServiceDescriptor = {
  barista: '',
  port: 3001,
  name: 'My Super Service',
  description: 'the test service',
  routes: routes,
  env: 'local',
  bodyLimit: 30,
  bodyParser: {
    xml: {
      options: {
        limit: '1MB', // Reject payload bigger than 1 MB
        xmlParseOptions: {
          normalize: true, // Trim whitespace inside text nodes
          normalizeTags: true, // Transform tags to lowercase
          explicitArray: false // Only put nodes in array if >1
        }
      }
    }
  },
  connections: [
    {
      name: 'amqp',
      type: 'amqp',
      descriptor: {
        host: process.env.RABBIT_HOST || 'localhost',
        username: process.env.RABBIT_USER || 'guest',
        password: process.env.RABBIT_PASSW || 'guest',
        heartbeat: 60,
        // eslint-disable-next-line camelcase
        consumer_cancel_notify: true,

        onError: () => console.log('error handling'),
        onCancel: () => console.log('cancel handling'),
        onClose: () => console.log('close handling')
      }
    },
    {
      name: 'redis',
      type: 'redis',
      descriptor: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSW
      }
    }
  ],
  subQueue: process.env.SUB_QUEUE || 'sub_test_task',
  pubQueue: process.env.PUB_QUEUE || 'pub_test_task',
  subscribers: [
    {
      prefetch: 1,
      queue: process.env.SUB_QUEUE || 'sub_test_task',
      pubQueue: {
        queue: process.env.PUB_QUEUE || 'pub_test_task',
        durable: true
      },
      durable: true,
      noAck: false,
      controller: async(message, {logger, connections}) => controller.rabbitTest(message, { logger, connections })
    }
  ]
};

const service = espresso.getService(localServiceDescriptor);

let appInstance = {};

const instance = () => {
  return appInstance;
};

const onStart = (serviceInstance) => {
  const logger = service.logger;
  appInstance = Object.assign({}, {
    started: true,
    service,
    logger
  }, serviceInstance);

  logger.info('Service Started: ', Date.now());
  // setTimeout(() => {
  //   logger.info('Stop service');
  //   service.stop('no need more... ', ' :Time expired');
  // }, 60 * 1000 * 10);
};

service.start().then(onStart);

module.exports = {
  instance
};

