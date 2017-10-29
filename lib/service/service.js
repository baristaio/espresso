'use strict';
import * as process from "babel-preset-node8";

export function getService (serviceDescriptor) {
    const descriptor = Object.assign({}, serviceDescriptor);
    const appServer = require('./espresso-express');
    const router = appServer.Router();
    const log = require('../logger').logger({name: descriptor.name});
    const expressLog = require('../logger').expressLogger();
    let server;

    const app = appServer();

    router.use(function (req, res, next) {
        next();
    });

    descriptor.routes.forEach( (route) => {
        // router[route.method] (route.path, route.controller);
        router[route.method] (route.path, async (req, res, next) => {
            route.controller(log, req, res, next);
        });
    });
    // setRoutes(router, descriptor.routes);

    const start = async () => {
        return new Promise((resolve, reject) => {
            const port = process.env.PORT || descriptor.port;
            app.use(expressLog);
            app.use('/', router);
            server = app.listen(port, () => {
                console.log('info', 'listening port:', port);
            });
            resolve(() => {
                stop(server)
            });
        });

    };

    const stop = (reason) => {
        log.info('Service %s will be stopped ', descriptor.name, reason);
        //  TODO:
        //      1. close all open resource connections
        //      2. log reason: crash, fail, manual, expired, other
        //      3. stop server
        server.close();
        log.info('Service %s stopped ', descriptor.name, reason);
    };

    return {
        start,
        stop
    };

}

/*
const start = async (serviceDescriptor, mode) => Promise.resolve(
    await startService(serviceDescriptor, mode)
);

async function startService(param) {
    return new Promise((resolve, reject) => {
        console.log('start service...');
        setTimeout(() => {
                console.log(param + ' started...');
                resolve(param + ' success!!!')
        }, 100)
    })
}

async function stop () {
    console.log('Stopped .....')
}


module.exports = {
        start,
        stop
};
*/


