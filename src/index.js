'use strict';
import test from "./test";


const componentName = 'App service (your service name)';

/*async function start(logger, config) {
  const logger = plogger.child({ component: componentName, fn: 'start' });
  logger.info('Starting');

  const stopHttpController = await startHttpController(plogger, config, rabbitmq);

  return async function stop(force = false) {
    logger.info({ fn: 'stop', force }, 'Stopping');
    await stopHttpController();
    logger.info({ fn: 'stop', force }, 'Stopped');
  };
}*/

test(componentName);
