interface Task {
    func: Function;
    param: any[];
    resolve: Function;
    reject: Function;
}

/**
 * A simple executor for queuing and executing asynchronous operations sequentially.
 * @class
 */
class executorC {
    quote: Task[];
    isExecuting: boolean;

    /**
     * Create a new executor instance.
     * @constructor
     */
    constructor() {
        this.quote = [];
        this.isExecuting = false;
    }

    /**
     * Add an asynchronous operation to the execution queue.
     */
    async addOp(func: Function, ...param) {
        return await new Promise((resolve, reject) => {
            this.quote.push({
                func,
                param,
                resolve,
                reject
            });
            this.execute();
        });
    }

    /**
     * Execute the queued asynchronous operations sequentially.
     */
    async execute() {
        if (this.isExecuting) return;
        this.isExecuting = true;
        while (this.quote.length > 0) {
            let q = this.quote.shift();
            let res = await q.func(...q.param);
            q.resolve(res)
        }
        this.isExecuting = false;
    }
}

export default executorC;