const log = require('./logger');
const defaultHeaders = {
    'Content-Type': 'application/json'
};

const mountController = (logParams, connections, descriptor) => {
    console.log(`Make controller for route  ${descriptor.route}`);
    return (req, res, next) => {
        const params = Object.assign({}, logParams, {
            requestId: req.id,
            route: descriptor.route
        });
        const logger = log.logger(params);

        descriptor.controller(logger, connections, req, res, next)
            .then(result => {
                if (result.status > 300 && result.status < 400) {
                    res.redirect(result.status, result.body);
                    return;
                }

                const body = typeof result.body === 'undefined' ? result : result.body;
                try {

                    const headers = Object.assign({},
                        result.headers || defaultHeaders,
                        descriptor.headers
                    );
                    res.set(headers);
                    res.status(result.status || 200).json(body);
                }
                catch (err) {
                    logger.error(descriptor, 'response not a JSON');
                    res.status(result.status || 200).send(body);
                }
            })
            .catch((err) => {
                logger.error('Error', err);
                res.status(500).send('Internal server error');
            });
    };
};

module.exports = {
    mountController
};
