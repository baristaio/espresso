
const connect = async(logger, connectionInfo, app) => {
  const server = require('http').createServer();
  const io = require('socket.io')(connectionInfo.port, connectionInfo.options);
  logger.info('Socket opened on port: ', connectionInfo.port);
  return io;
};

module.exports = {
  connect
};
