# espresso
The micro service sugar

## Install

> npm i 


## API



## Confifuration 

## Examples
```javascript
const espresso = required('espresso');
const controller = required('./controllers/<your controller>');

espresso.init({
    name: 'myService',
    controllers: [
        {
            name: 'controller.name',
            params: [
                {
                    name: "paramName",
                    type: "type"
                }
            ]}
        ]
});

```


