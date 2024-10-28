
const connect = (logger, connectionInfo) => {
    return new Promise((resolve)=> {
        const io = require('socket.io')(connectionInfo.port, connectionInfo.options);
        logger.info('Socket opened on port: ', connectionInfo.port);
        return resolve(io);
    });
};

module.exports = {
    connect
};
