
const config = require('../config.json');
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

const mongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const port = process.env.PORT || config.port; // set our port

// ROUTES FOR OUR API
// =============================================================================
const router = express.Router(); // get an instance of the express Router
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

export async function getInstance(serviceDescriptor, logger) {
  mongoClient.connect(config.mongodb.uri, (err, db) => {
    console.log("Mongodb connected successfully ...");
    const mongoConnection = db;
    app.listen(port, () => {
      console.log('info', 'listening port:', port);
    });
  });

  const app = express();

  return app;
}

