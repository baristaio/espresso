type CallbackFunctionVariadicAnyReturn = (...args: any[]) => any;


export interface Route {
    headers: object,
    route: string,
    method: string,
    controller: CallbackFunctionVariadicAnyReturn,
}


export interface Subscriber {
    prefetch: number,
    queue: string,
    pubQueue: object,
    durable: boolean,
    noAck: true,
    controller: CallbackFunctionVariadicAnyReturn
}


