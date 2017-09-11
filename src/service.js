export  const stop = () => {
    console.log('service stopped');
};
export const start = (name) =>  {
    console.log('Service ' + name + ' started');
    return stop;
};
