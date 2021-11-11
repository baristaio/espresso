const log = require('./logger');

const mountController = (logLevel, connections, descriptor) => {
  console.log(`Make controller for route  ${descriptor.route}`);
  return (req, res, next) => {

    const logger = log.logger({
      name: req.id,
      route: descriptor.route,
      level: logLevel
    });

    descriptor.controller(logger, connections, req, res)
      .then(result => {
        logger.trace(result);
        if (result.status === 301) {
          res.redirect(result.body);
          return;
        }
        const body = typeof result.body === 'undefined' ? result : result.body;
        try {
          const headers = Object.assign({},
            result.headers || {},
            descriptor.headers
          );
          res.set(headers);
          res.status(result.status || 200).json(body);
        }
        catch (err) {
          logger.warn(descriptor, 'response not a JSON');
          res.status(result.status || 200).send(body);
        }
      })
      .catch((err) => {
        logger.info('Error', err);
        res.status(500).send('Internal server error');
      });
  };
};

module.exports = {
  mountController
};
