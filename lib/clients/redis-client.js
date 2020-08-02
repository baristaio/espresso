const redis = require('redis');
const connect = (logger, config) => {
  const {port, host, password} = config.options;
  return new Promise((resolve, reject) => {
    const client = redis.createClient({port, host});
    client.on('connect', () => {
      logger.info('Redis client connected');
      client.auth(password, (error) => {
        if (error) {
          logger.error(error.message);
          reject('REDIS connection failed', error.message);
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
