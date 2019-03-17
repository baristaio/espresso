
const connect = async(logger, connectionInfo, app) => {
  const http = require('http').Server(app);
  return require('socket.io')(http);
};

module.exports = {
  connect
};
