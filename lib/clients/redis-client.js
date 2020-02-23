const redis = require('redis');
const connect = (logger, options) => {
  return new Promise(resolve => {
    const client = redis.createClient({
      port: options.port,
      host: options.host,
      password: options.password
    });

    client.on('connect', () => {
      logger.info('Redis client connected');
      return resolve(client);
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
