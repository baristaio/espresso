const amqpLib = require('amqplib/callback_api');

function bail(logger, err, conn) {
  logger.error(err);
  console.error(err);
  if (conn) {
    conn.close();
  }
}

const connect = (logger, amqpConfig) => {
  return new Promise((resolve, reject) => {
    const amqpHost = `amqp://${amqpConfig.username }:${amqpConfig.password}@${amqpConfig.host}`;
    amqpLib.connect(amqpHost, amqpConfig.options, (err, conn) => {
      if (err !== null) {
        bail(logger, err, conn);
        return reject(err);
      }

      process.once('SIGINT', () => {
        conn.close();
        return reject('SIGINT');
      });

      logger.info('rabbitmq started on host', amqpHost);
      return resolve(conn);
    });
  });

};

module.exports = {
  connect
};
