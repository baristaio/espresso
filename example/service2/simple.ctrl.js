
//  business method
const sayHello = (name) => `Service 2: Hello ${name}!!!`;

// controller
export async function sayHelloController(log, req, res) {
    return new Promise(resolve => {
        log.info(sayHelloController);
        setTimeout(() => {
            const value = req.param('name');
            res.send(sayHello(value));
            resolve();
        }, 100);

    });

}
export function baristaHello(log, req, res) {
    return new Promise(resolve => {
        log.info(sayHelloController);
        res.send('Hello Barista!!!');
        resolve();
    });
}
