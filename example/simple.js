const espresso = require('../lib');

const routes = {};
const serviceDescriptor = {
    name: 'service name',
    description: 'the test service',
    routes: routes
};

// const service = espresso.start(serviceDescriptor, 2);
const start = async (param) => await espresso.startTest(param);

start('Test').then((value) =>  console.log(value));

// Local
const localServiceDescriptor = {
    name: 'service name',
    description: 'the test service',
    routes: routes,
    env: 'local'
};

const service = espresso.getService(localServiceDescriptor);
service.start();
// Dev start


// Prod Start


