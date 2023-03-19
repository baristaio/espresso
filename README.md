# IN DEVELOPMENT: PLEASE DON'T USE

### espresso
The micro service wrapper

The espresso is a NodeJS service wrapper for controllers.

This service provides following goodies:
- access validation JWT based 
- context log
- service log
- connections
  - Redis
  - Mongo 
  - Neo4J
  - Other
 - controllers routing 
 - registration in service manager - Barista   


## Release
0.1.0 upgrade redis client to version 4.x.x 

## Install

> npm i 



# API

## ServiceDescriptor 
 - Service name
 - config
 - routes


## Espresso API
 - register (serviceDescriptor): registration the service in Barista
    - registration running after installation
 - createInstance(ServiceDescriptor) -> create the service instance with:
    - logger 
    - db connection pool
    
 - isAvailable: return status       

    
## Service API
 - Service properties
    - token (JWT): received from Barista
        -   service name
        -   env (environment)
        -   instance ID
        
    - start: 
        - mode: (test, local, debug, prod)
        return status
    - stop
    - routes: 
    { 
        route: "route",
        controller: "controller"
    }
    
    - persistence
        - getClient
            - Mongo
            - Redis
            - Neo4J
    
## Controller API 
ControllerDescriptor
```json
{
    "name": "string",
    "route": "string",
    "req": "request",
    "res": "response",
    "next": "next" ,
    "callback": "function",
    "connections": ["mongoClient", "redisClient", "etc"]
}
````

 
 
 ## Resources
 Resources = { Mongo, Mongoose, Redis, NeoJ4 }
 - getResource(Resources.Mongo)





## Examples


```javascript
const espresso = required('espresso');
const controller = required('./controllers/<your controller>');

const service = espresso.getService({
    name: 'myService',
});

service.start();

service.stop('reason');
```

for run example please use node parameters: -r babel-register:

> npm i 

> cd example

> node -r babel-register simple.js 


the service will stoped after 1 minute.

