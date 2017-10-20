/**
 *
 *
 */

export const appService = (token, serviceDescriptor, logger, app) => {
    const logger = logger;
    Object.assign(this, {token, servi})

};

export class CommonService {
    constructor (token, serviceDescriptor, logger, app) {
        Object.assign(this, {
            name: serviceDescriptor.name,
            config: serviceDescriptor.config,
            routes: serviceDescriptor.routes,
            token: token,
            app: app,
            logger: logger
        });

    }

    start() {
        this.logger.info('Starting service ', this.name);
    }

    stop(reason = '') {
        this.logger.info('Starting service ', this.name);

    }

    status() {

    }

}