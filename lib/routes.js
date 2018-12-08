const controller = require('./controller');

const servicesRoutes = (logger, services) => {
  return services.map(service => {
    return {
      route: service.url,
      method: service.method,
      controller: controller.makeController(logger, service)
    };
  });
};

module.exports = {
  servicesRoutes
};

