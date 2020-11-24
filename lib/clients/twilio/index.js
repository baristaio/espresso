const twilio = require('twilio');

function connect(logger, config) {
  try {
    const client = twilio(config.accountSid, config.authToken);
    logger.info('Twilio client started');
    return client;
  } catch (e) {
    logger(e);
    return null;
  }

}

module.exports = {
  connect
};
