//  business method
const sayHello = (name) => `Hello ${name}!!!`;
const foo = (logger, text) => logger.info(text);

// controller
function sayHelloController(log, connections, req, res) {
    const service = require('./simple');//
    // const t = service.test();
    log.info('Hello');
    const instance = service.instance();

    if (instance.started) {
        log.info('Logger test');
    }

    return new Promise(resolve => {
        log.info(sayHelloController);
        setTimeout(() => {
            const value = req.url;
            resolve({value});
        }, 100);
    });
}

function helloWorldController(log, connections, req, res) {
    foo(log, '.. call before');
    return new Promise(resolve => {
        log.info(sayHelloController);
        foo(log, 'resolve..');
        resolve({status: 200, body: 'Hello world!!!'});
    });
}

const readTest = async(logger, connections, req) => {
    return mySqlTest(logger, connections, 'mysql-read');
};

const redisTest = (logger, connections, req) => {
    logger.info('redis test');
    const client = connections.redis;
    client.set('foo', 'bar1');

    return new Promise(resolve => {
        client.get('foo', (error, value) => {
            if (error) {
                throw error;
            }
            logger.info(`foo ---> ${value}`);
            resolve({value});
        });
    });
};

const rabbitTest = async(message, { logger, connections }) => {
    logger.info(`Rabbit test:  ${message}`);
    const response = {
        message: message,
        doPublish: true
    };
    response.doPublish = true;
    return response;
};

const writeTest = async(logger, connections, req) => {
    return mySqlTest(logger, connections, 'mysql-write');
};

const mySqlTest = async(logger, connections, connectionName) => {
    const connection = connections[connectionName];
    let conn;
    try {
        conn = await connection.getConnection();
        const [rows] = await conn.query('SELECT * from tests');
        conn.release();
        return rows;
    }
    catch (e) {
        if (conn) {
            conn.release();
        }
    }
    return {};
};

module.exports = {
    sayHelloController,
    helloWorldController,
    writeTest,
    readTest,
    redisTest,
    rabbitTest
};
