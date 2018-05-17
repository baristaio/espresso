
import 'babel-polyfill';

const espresso = require('../../lib/index');
const controller = require('./simple.ctrl');

export const routes = [
  {
    path: '/hello',
    method: 'get',
    controller: controller.sayHelloController
  },
  {
    path: '/world',
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
  env: 'local'
};

const service = espresso.getService(localServiceDescriptor);
const stop = service.start();

// stop the service after 1 minute
setTimeout(()=> {
  service.stop(localServiceDescriptor.name, ' :Time expired');
}, 60 * 1000 * 3);

// Dev start

// Prod Start

