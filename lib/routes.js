const controller = require('./controller');

const servicesRoutes = (logger, services) => {
  return services.map(service => {
    return {
      route: service.url,
      method: service.method,
      controller: controller.mountController(logger, service)
    };
  });
};

module.exports = {
  servicesRoutes
};

