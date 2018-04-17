
import 'babel-polyfill';

const espresso = require('../../lib');
const controller = require('./simple.ctrl');

export const routes = [
  {
    path: '/hello/:name',
    method: 'get',
    controller: controller.sayHelloController
  },
  {
    path: '/barista',
    method: 'get',
    controller: controller.baristaHello
  }
];

const localServiceDescriptor = {
  barista: '',
  port: 3001,
  name: 'My Super Service 2',
  description: 'the test service 2',
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

