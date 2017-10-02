# espresso
The micro service sugar

## Install

> npm i 


## API
- espresso.getService
 params: 
    service name
 return service ()
    
- Service API
    - start: start the service and return the stop method
    - stop
    - routes: 
    { 
        route: "route",
        controller: "controller"
    }
    




## Confifuration 

## Examples
```javascript
const espresso = required('espresso');
const controller = required('./controllers/<your controller>');

const service = espresso.getService({
    name: 'myService',
});

service.use('')

```


