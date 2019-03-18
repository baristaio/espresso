const mysql = require('mysql2');
const connect = async(logger, connectionInfo) => {
  const pool = mysql.createPool(connectionInfo);
  return pool.promise();
};

module.exports = {
  connect
};
