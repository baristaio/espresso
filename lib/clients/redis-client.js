const redis = require('redis');
const connect = (logger, config) => {
    const {port, host, password, legacyMode} = config;

    return new Promise((resolve, reject) => {
        const client = redis.createClient({
            legacyMode: typeof legacyMode === 'undefined' ? true : legacyMode,
            socket: {
                port,
                host
            },
            password
        });
        client.connect().then(()=> logger.info('Redis client connected'));

        // eslint-disable-next-line consistent-return
        client.on('connect', (connectionError) => {
            if (connectionError) {
                logger.error('REDIS CONNECTION:', connectionError.toLocaleString());
                return reject(connectionError);
            }
            logger.info('Redis client connected');
            resolve(client);
        });
        client.on('error', (err) => {
            logger.error('Something went wrong ' + err);
            return reject(err);
        });
    });
};

module.exports = {
    connect
};
