
const mount = (logger, connections, descriptor) => {
  logger.info(`Make pub/sub   ${descriptor.queue}`);
  const amqp = connections.amqp;

  amqp.createChannel((err, ch) => {
    if (err !== null) {
      logger.error(err);
    }

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

              logger.debug(`AMQP: Post to queue ${descriptor.pubQueue.queue}, message: ${resMsg}`);
              ch.sendToQueue(descriptor.pubQueue.queue, Buffer.from(resMsg));
            }
            console.log('AMQP on ack msg');
            ch.ack(msg);
          });
      }, { noAck: descriptor.noAck });
    });
  });
};

const postToQueue = (logger, connection, queueName, message) => {
  logger.info(`Post to queue ${queueName}`);
  logger.debug(`Post message ${JSON.stringify(message)} to queue ${queueName}`);
  const amqp = connection.amqp;

  amqp.createChannel((err, ch) => {
    if (err !== null) {
      // bail(logger, err, amqp);
      logger.error(err);
    }
    ch.assertQueue(queueName);
    ch.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
    logger.debug(`Message ${JSON.stringify(message)}  posted to queue ${queueName}`);
    return ch.close();
  });
};

module.exports = {
  mount,
  postToQueue
};
