const espresso = require('../../lib/index');
const controller = require('./simple.ctrl');

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
  }
];

const localServiceDescriptor = {
  barista: '',
  port: 3000,
  name: 'My Super Service',
  description: 'the test service',
  routes: routes,
  env: 'local',
  connections: [
    {
      name: 'amqp1',
      type: 'amqp',
      descriptor: {
        host: process.env.RABBIT_HOST || '127.0.0.1',
        options: {
          login: process.env.RABBIT_USER || 'guest',
          password: process.env.RABBIT_PASSW || 'guest'
        }
      }
    },
    {
      name: 'amqp2',
      type: 'amqp',
      descriptor: {
        host: process.env.RABBIT_HOST || '127.0.0.1',
        options: {
          login: process.env.RABBIT_USER || 'guest',
          password: process.env.RABBIT_PASSW || 'guest'
        }
      }
    }
  ]
  // subQueue: process.env.SUB_QUEUE || 'sub_test_task',
  // pubQueue: process.env.PUB_QUEUE || 'pub_test_task',
  // subscribers: [
  //   {
  //     prefetch: 1,
  //     queue: process.env.SUB_QUEUE || 'sub_test_task',
  //     pubQueue: {
  //       queue: process.env.PUB_QUEUE || 'pub_test_task',
  //       durable: true
  //     },
  //     durable: true,
  //     noAck: false,
  //     controller: async(message, {logger, connections}) => actions.doAction(message, { logger, connections })
  //   }
  // ]
};

const service = espresso.getService(localServiceDescriptor);
const stop = service.start();

// stop the service after 1 minute
setTimeout(() => {
  service.stop(localServiceDescriptor.name, ' :Time expired');
}, 60 * 1000 * 3);

// Dev start

// Prod Start

