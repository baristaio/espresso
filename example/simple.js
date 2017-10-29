"use strict";
import 'babel-polyfill'

const espresso = require('../lib');
const controller = require('./simple.ctrl');

export const routes = [
    {
        path: '/hello',
        method: 'get',
        controller: controller.sayHelloController
    },
    {
        path: '/hello1',
        method: 'get',
        controller: controller.sayHelloController
    },
    {
        path: 'hello1',
        method: 'put',
        controller: controller.sayHelloController
    }
];


const localServiceDescriptor = {
    port: 3000,
    name: 'service name',
    description: 'the test service',
    routes: routes,
    env: 'local'
};

const service = espresso.getService(localServiceDescriptor);
const stop = service.start();

// stop the service after 1 minute
setTimeout( ()=> {
    service.stop('Time expired');
}, 60* 1000);

// Dev start


// Prod Start


