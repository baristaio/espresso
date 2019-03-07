
//  business method
const sayHello = (name) => `Hello ${name}!!!`;

// controller
function sayHelloController(log, connections, req, res) {
  return new Promise(resolve => {
    log.info(sayHelloController);
    setTimeout(() => {
      const value = req.query.name;
      res.send(sayHello(value));
      resolve();
    }, 100);
  });
}

function helloWorldController(log, connections, req, res) {
  return new Promise(resolve => {
    log.info(sayHelloController);
    res.send('Hello world!!!');
    resolve();
  });
}

const readTest = async(logger, connections, req) => {
  return mySqlTest(logger, connections, 'mysql-read');
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
  readTest
};
