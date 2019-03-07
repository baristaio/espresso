const assert = require('assert');
const bunyan = require('bunyan');
const logger = bunyan.createLogger({ name: 'tests' });
const mongoClient = require('./clients/mongodb-client');

// const carModel = require('../../test/car');

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
  it('demmy', ()=> {
    assert.ok(true);
  });
});

describe('Mongodb Tests', () =>{
  let db = null;

  it('Connection test', async()=> {
    db = await mongoClient.connect(logger, mongodbConfig);
    assert.notEqual(db, null);

  });

  it('Connection test', async()=> {
    const doc1 = Object.assign({}, { eventId: 1, file: 'test.jpg' }, carModel);
    const res = await db.collection('test').insert(doc1);
    assert(res);

  });

  it('Connection test', async()=> {
    const res = await db.collection('test').find({ car: { location: 'all' } });

    // db.collection('test').insert(doc1);
    // assert(res);

  });

});
