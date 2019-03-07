const mountController = (logger, connections, descriptor) => {
  logger.info(`Make controller for route  ${descriptor.route}`);
  return (req, res) => {
    descriptor.controller(logger, connections, req)
      .then(result => {
        logger.trace(result);
        const body = result.body || result;
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
      .catch(err => res.status(500).send(err));
  };
};

module.exports = {
  mountController
};
