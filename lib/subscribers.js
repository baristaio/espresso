//
const mount = (logger, connections, descriptor) => {
  logger.info(`Make pub/sub   ${descriptor.queue}`);
  const amqp = connections.amqp;

  // const onChannelClosed = () => {
  //   setTimeout(()=> {
  //     mount(logger, connections, descriptor);
  //     console.error('The CHANNEL was restored');
  //   }, 100);
  // };

  amqp.createChannel((err, ch) => {
    if (err !== null) {
      logger.error(err);
    }

    ch.on('cancel', () => {
      logger.error('CHANNEL_CANCEL: channel was canceled');
      // onChannelClosed();
    });

    ch.on('close', () => {
      logger.error('CHANNEL_CLOSED: channel was closed');
      // onChannelClosed();
    });

    ch.assertQueue(descriptor.queue, { durable: descriptor.durable }, (error) => {
      if (error !== null) {
        // bail(logger, error, amqp);
        logger.error(error);
      }

      if (descriptor.prefetch) {
        ch.prefetch(descriptor.prefetch);
      }
      ch.consume(descriptor.queue, async(msg) => {
        const messageBody = msg.content.toString().trim();

        descriptor.controller(messageBody, { logger, ch, connections })
          .then(result => {
            if (descriptor.pubQueue && result.doPublish) {
              ch.assertQueue(descriptor.pubQueue.queue, { durable: descriptor.pubQueue.durable });

              const resMsg = (typeof (result.message) === 'object') ?
                JSON.stringify(result.message) : result.message.toString();

              logger.debug(`AMQP: Post to queue ${descriptor.pubQueue.queue}`);
              logger.trace(`AMQP: Post to queue ${descriptor.pubQueue.queue}, message: ${resMsg}`);
              ch.sendToQueue(descriptor.pubQueue.queue, Buffer.from(resMsg));
            }
            ch.ack(msg);
          });
      }, { noAck: descriptor.noAck });
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

// @deprecated
const postToQueue = (logger, connection, queueName, message) => {
  logger.info(`Post message to queue ${queueName}`);
  const messageStr = stringifyMessage(message);
  if (!messageStr) {
    throw new Error('Unexpected message format, should be JSON or string');
  }

  const amqp = connection.amqp;

  amqp.createChannel((err, ch) => {
    if (err !== null) {
      // bail(logger, err, amqp);
      logger.error(err);
    }
    ch.assertQueue(queueName);
    ch.sendToQueue(queueName, Buffer.from(messageStr));
    logger.debug(`Message posted to queue ${queueName}`);
    logger.trace(`Message ${messageStr} posted to queue ${queueName}`);
    return ch.close();
  });
};

module.exports = {
  mount,
  postToQueue
};
