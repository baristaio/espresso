const bunyan = require('bunyan');
const logger = bunyan.createLogger({ name: 'tests' });
const myTest = require('../example/mytest').mytest;
const mongoClient = require('../lib/clients/mongodb-client');

// const carModel = require('../../test/car');
const mongoConnected = false;

const mongodbConfig = {
    username: process.env.MONGODB_USER,
    password: process.env.MONGODB_PASSW,
    host: process.env.MONGODB_HOST,
    dbName: process.env.MONGODB_DB_NAME,
    options: {
        poolSize: process.env.MONGO_POOL_SIZE || 10,
        autoReconnect: process.env.MONGO_AUTO_RECONNECT || true,
        reconnectTries: process.env.MONGO_RECONNECT_TRIES || 30
    }
};

describe('Service main test', () => {
    test('dummy', ()=> {
        expect(true).toBeTruthy();
    });

    test('my test', () => {
        expect(myTest('test')).toBe('test');
    });
});

if (mongoConnected) {
    describe('Mongodb Tests', () =>{
        let db = null;

        test('Connection test', async()=> {
            db = await mongoClient.connect(logger, mongodbConfig);
            expect(db).toBeNull();

        });

        test('Connection test', async()=> {
            const doc1 = Object.assign({}, { eventId: 1, file: 'test.jpg' }, carModel);
            const res = await db.collection('test').insert(doc1);
            expect(res).toBeNull();
        });

        test('Connection test', async()=> {
            const res = await db.collection('test').find({ car: { location: 'all' } });

            // db.collection('test').insert(doc1);
            // assert(res);

        });

    });

}
