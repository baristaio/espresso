const logger = require('../logger').logger({name: 'TEST'});
const mountConnections = require('./index').mount;

jest.setTimeout(3600000);

const legacyRedis = 'legacyRedis';
const redisClientName = 'redisClient';

const config = [
    {
        name: legacyRedis,
        type: 'redis',
        descriptor: {
            legacyMode: true,
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT * 1,
            password: process.env.REDIS_PASSW
        }
    },
    {
        name: redisClientName,
        type: 'redis',
        descriptor: {
            legacyMode: false,
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT * 1,
            password: process.env.REDIS_PASSW
        }
    }];

describe('Redis connection tests', () => {
    let redisClient; let redis;
    let connections;
    // let subscribers;
    beforeAll(async() => {
        connections = await mountConnections(logger, config);
        redisClient = connections[redisClientName];
        redis = connections[legacyRedis];
    });

    test('Legacy test', async() => {
        const value = Date.now();
        const key = 'legacy-test-key';
        await Promise.all([new Promise((resolve, reject) => {
            redis.set(key, value, 'EX', 100, (error) => {
                if (error) {
                    logger.error(error.toLocaleString());
                    return reject(error);
                }
                return resolve();
            });
        })]);

        const legacyRedisExpected = await Promise.all([new Promise((resolve, reject) => {
            redis.get(key, (error, result) => {
                if (error) {
                    logger.error(error.toLocaleString());
                    return reject(error);
                }
                return resolve(result);
            });
        })]);

        const expected = await redisClient.get(key);
        expect(expected).toBe('' + value);
        expect(legacyRedisExpected[0]).toBe('' + value);
    });
});
