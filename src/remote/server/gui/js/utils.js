class AutoUpdater{
    constructor(obj, key, selector, updateCB){
        this.obj = obj;
        this.key = key;
        this.element = document.querySelector(selector);
        this.updateCB = updateCB;
        this.init();
    }

    init(){
        this.updateElement();
        this.watch();
    }

    updateElement(){
        let value = this.obj[this.key];
        const formattedValue = this.updateCB ? this.updateCB(value) : value;
        this.element.innerHTML = formattedValue; 
    }

    watch(){
        let currentValue = this.obj[this.key];
        
        Object.defineProperty(this.obj, this.key, {
            set: (newValue) => {
                currentValue = newValue;
                this.updateElement();
            },
            get: () => currentValue
        });
    }
}

function getSelectedDatabase(){
    return serversData[vars.selectedServer][vars.selectedDb];
}