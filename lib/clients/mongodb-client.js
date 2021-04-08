const MongoClient = require('mongodb').MongoClient;
const makeUri = (host, username, password, dbName) => `mongodb://${username}:${password}@${host}/${dbName}`;

const connect = (logger, mongodbInfo) => {
  logger.info('create mongodb connector');
  return new Promise((resolve, reject) => {
    const uri = makeUri(mongodbInfo.host, mongodbInfo.username, mongodbInfo.password, mongodbInfo.dbName);
    return MongoClient.connect(uri, mongodbInfo.options, (err, client) => {
      if (err) {
        logger.error('Error occurred while connecting to MongoDB Atlas...\n', err);
        return reject(err);
      }

      logger.info('Mongodb Connected...');
      const db = client.db(mongodbInfo.dbName);

      const test = db.collection('test');
      const data = test.find();
      logger.trace('find: ', data);
      // console.log(data);
      // perform actions on the collection object
      // client.close();
      return resolve(db);
    });
  });
};

module.exports = {
  connect
};
