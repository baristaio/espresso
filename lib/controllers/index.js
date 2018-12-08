
const controller = require('./controllers');

module.exports = {
  routes: require('./httpControllers'),
  subs: require('./amqpControllers'),
  onStart: controller.onStart,
  health: controller.health
};

