
const service = require('./service/service');

module.exports = {
  getService: service.getService,
  subscribers: require('./subscribers')
};
