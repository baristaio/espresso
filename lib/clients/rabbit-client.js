const amqpLib = require('amqplib/callback_api');

function bail(logger, err, conn) {
  logger.error(err);
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

      conn.on('error', () => {
        logger.error('connection error');
        if (typeof amqpConfig.onError === 'function') {
          amqpConfig.onError();
        }
      });

      conn.on('close', () => {
        console.error('connection closing');
        if (typeof amqpConfig.onClose === 'function') {
          amqpConfig.onClose();
        }
      });

      process.once('SIGINT', () => {
        conn.close();
        return reject('SIGINT');
      });

      logger.info('rabbitmq started on host', amqpHost);
      return resolve(conn);
    });
  });

};

const stringifyMessage = message => {
  switch (typeof(message)) {
  case 'undefined': return null;
  case 'string': return message;
  case 'object': return JSON.stringify(message);
  default: return null;
  }
};

const postToQueue = (logger, amqp, queueName, message) => {
  const messageStr = stringifyMessage(message);
  return new Promise(((resolve, reject) => {
    if (!messageStr) {
      reject('Unexpected message format, should be JSON or string');
    }
    amqp.createChannel((err, ch) => {
      if (err !== null) {
        // bail(logger, err, amqp);
        logger.error(err);
        reject(err);
      }
      ch.assertQueue(queueName);
      ch.sendToQueue(queueName, Buffer.from(messageStr));
      logger.debug(`Message posted to queue ${queueName}`);
      logger.trace(`Message ${messageStr} posted to queue ${queueName}`);
      ch.close();
      resolve();
    });
  }));
};

module.exports = {
  connect,
  postToQueue
};
