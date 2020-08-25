const redis = require('redis');
const connect = (logger, config) => {
  const {port, host, password} = config;
  return new Promise((resolve, reject) => {
    const client = redis.createClient({port, host});
    // eslint-disable-next-line consistent-return
    client.on('connect', (connectionError) => {
      if (connectionError) {
        logger.error('REDIS CONNECTION:', connectionError.toLocaleString());
        return reject(connectionError);
      }

      logger.info('Redis client connected');
      if (!password) {
        return resolve(client);
      }
      client.auth(password, (error) => {
        if (error) {
          logger.error(error.message);
          return reject('REDIS connection failed', error.message);
        }
        logger.info('authorized');
        return resolve(client);
      });

    });
    client.on('error', (err) => {
      logger.error('Something went wrong ' + err);
      return resolve(err);
    });
  });
};

module.exports = {
  connect
};
