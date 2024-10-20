/**
 * A simple executor for queuing and executing asynchronous operations sequentially.
 * @class
 */
class executorC{
    /**
     * Create a new executor instance.
     * @constructor
     */
    constructor(){
        this.quote = [];
        this.isExecuting = false;
    }

    /**
     * Add an asynchronous operation to the execution queue.
     *
     * @async
     * @function
     * @param {Function} func - The asynchronous function to execute.
     * @param {...*} param - Parameters to pass to the function.
     * @returns {Promise} A Promise that resolves when the operation is executed.
     */
    async addOp(func, ...param){
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
     *
     * @async
     * @function
     */
    async execute(){
        if(this.isExecuting) return;
        this.isExecuting = true;
        while(this.quote.length > 0){
            let q = this.quote.shift();
            let res = await q.func(...q.param);
            q.resolve(res)
        }
        this.isExecuting = false;
    }
}

export default executorC;