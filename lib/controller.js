const makeController = (logger, connections, descriptor) => {
  logger.info(`Make controller for route  ${descriptor.route}`);
  return (req, res) => {
    descriptor.controller(logger, connections, req)
      .then(result => {
        logger.trace(result);
        try {
          res.set(descriptor.headers);
          res.status(result.status || 200).json(result.body);
        }
        catch (err) {
          logger.warn(descriptor, 'response not a JSON');
          res.status(result.status || 200).send(result.body);
        }
      })
      .catch(err => res.status(500).send(err));
  };
};

module.exports = {
  makeController
};
