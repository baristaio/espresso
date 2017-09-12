'use strict';

const config = require('./config.json');



async function start () {
/*
    let removeProcessEventListeners;
    let app;

    const start = async () => {
        removeProcessEventListeners = appendProcessEventListeners(serviceLogger, stop);

        try {

            // Init additional services (mongo client, redis client, ets)
            app = await Controller.start(serviceLogger, config);
        }
        catch (err) {
            logger.error({ err }, err.message);
            stop({ reason: err.reason });
            throw err;
        }

        logger.info('Service started');
    };


    const stop = async ({ reason = 'UserRequested' } = {}) => {
        const logger = serviceLogger.child({ fn: 'stop', reason, stopReason, isStopped, isStopping });
        if (isStopping || isStopped) {
            logger.warn(`'stop()' called but service is already stopping or stopped`);
            return;
        }

        logger.info('Stopping service');
        isStopping = true;
        stopReason = reason;
        removeProcessEventListeners();

        if (stopController) {
            await stopApp();
        }

        isStopped = true;
        logger.info('Service stopped');
    };
*/
}

function appendProcessEventListeners(gLogger, stopService) {
    const logger = gLogger.child({ fn: 'appendProcessEventListeners' });

    const handlers = {
        warning(err) {
            logger.warn({ err }, 'Process warning');
            throw err;
        },
        unhandledRejection(err, promise) {
            logger.error({ err, promise }, 'Unhandled rejection');
            throw err;
        },
        uncaughtException(err) {
            logger.fatal({ err }, 'Uncaught exception');
            stopService({ reason: 'UncaughtException' });
        },
        SIGTERM() {
            logger.info('Process received SIGTERM');
            stopService({ reason: 'SIGTERM' });
        }
    };

    each(handlers, (handler, name) => process.addListener(name, handler));

    return () => each(handlers, (handler, name) => process.removeListener(name, handler));
}

module.export = {start};
