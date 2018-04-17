
//  business method
const sayHello = (name) => `Hello ${name}!!!`;

// controller
export async function sayHelloController(log, req, res, next) {
  return new Promise(resolve => {
    log.info(sayHelloController);
    setTimeout(() => {
      const value = req.query.name;
      res.send(sayHello(value));
      resolve();
    }, 100);

  });

}
export function romaSayHello(log, req, res) {
  return new Promise(resolve => {
    log.info(sayHelloController);
    res.send('hello world!!!');
    resolve();
  });
}
