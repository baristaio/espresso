const espresso = require('../../lib/index');
const controller = require('./simple.ctrl');

const routes = [
  {
    'headers': {'Content-Type': 'application/json'},
    route: '/hello',
    method: 'get',
    controller: controller.sayHelloController
  },
  {
    'headers': {'Content-Type': 'application/json'},
    route: '/world',
    method: 'get',
    controller: controller.helloWorldController
  },
  {
    'headers': {'Content-Type': 'application/json'},
    'route': '/readTest',
    'method': 'GET',
    controller: controller.readTest
  },
  {
    'headers': {'Content-Type': 'application/json'},
    'route': '/writeTest',
    'method': 'GET',
    controller: controller.writeTest
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
      name: 'mysql-read',
      type: 'mysql',
      descriptor: {
        host: process.env.MYSQL_ROHOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSW,
        database: process.env.MYSQL_DB
      }
    },
    {
      name: 'mysql-write',
      type: 'mysql',
      descriptor: {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSW,
        database: process.env.MYSQL_DB
      }
    }]
};

const service = espresso.getService(localServiceDescriptor);
const stop = service.start();

// stop the service after 1 minute
setTimeout(() => {
  service.stop(localServiceDescriptor.name, ' :Time expired');
}, 60 * 1000 * 3);

// Dev start

// Prod Start

