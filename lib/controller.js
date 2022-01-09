const log = require('./logger');

const mountController = (logParams, connections, descriptor) => {
  console.log(`Make controller for route  ${descriptor.route}`);
  return (req, res, next) => {

    const params = Object.assign({}, logParams, {
      requestId: req.id,
      route: descriptor.route
    });
    const logger = log.logger(params);

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
          logger.error(descriptor, 'response not a JSON');
          res.status(result.status || 200).send(body);
        }
      })
      .catch((err) => {
        logger.error('Error', err);
        res.status(500).send('Internal server error');
      });
  };
};

module.exports = {
  mountController
};
