const mysql = require('mysql2');
const connect = async(logger, connectionInfo) => {
  const pool = mysql.createPool(connectionInfo);

  //  close connection pool
  // process.once('SIGINT', () => {
  //   pool.close();
  //   return 0;
  // });

  return pool.promise();
};

module.exports = {
  connect
};
