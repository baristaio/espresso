'use strict';




async function stop() {

}

async function start() {


}






 // const startTest = async (param) => {
async function startTest(param) {
      // startService(param)
    const result = await startService(param);
    console.log(result + '-> sdgjasdjasdgajd');
    return result;

 }


const start = async (serviceDescriptor, mode) => Promise.resolve(
    await startService(serviceDescriptor, mode)
);

async function startService(param) {
    return new Promise((resolve, reject) => {
        console.log('start service...');
        setTimeout(() => {
                console.log(param + ' started...');
                resolve(param + ' success!!!')
        }, 100)
    })
}

async function stop () {
    console.log('Stopped .....')
}


module.exports = {
        start,
        stop,
        startTest

};
