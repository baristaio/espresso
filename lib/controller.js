const log = require('./logger');
const FLOW_ID = 'flowid';
const defaultHeaders = {
    'Content-Type': 'application/json'
};

const mountController = (logParams, connections, descriptor) => {
    console.log(`Make controller for route  ${descriptor.route}`);
    return (req, res, next) => {
        const flowId = req.headers[FLOW_ID] || '';
        const params = Object.assign({}, logParams, {
            requestId: req.id,
            route: descriptor.route
        });
        if (flowId) {
            params[FLOW_ID] = flowId;
        }
        const logger = log.logger(params);

        descriptor.controller(logger, connections, req, res, next)
            .then(result => {
                logger.trace(result);
                if (result.status === 301) {
                    res.redirect(result.body);
                    return;
                }
                const body = typeof result.body === 'undefined' ? result : result.body;
                try {
                    // copy headers from descriptor and result
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
