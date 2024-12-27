const queryDbFunc = {
    queryInput: document.querySelector("#query"),
    queryTypeSelect: document.querySelector("#query-type"),
    queryContextInput: document.querySelector("#query-context"),
    queryContextLabel: document.querySelector("#query-context-label"),
    queryOptsInput: document.querySelector("#query-opts"),

    renderData(){
        if(!db_data || db_data.length == 0){
            data_output.innerHTML = "<p>No data</p>";
            return;
        }
        data_output.innerHTML = templates.tableData({ data: db_data });
    },

    init(){
        document.querySelector("#query-db-btn").addEventListener("click", async () => {
            let query = queryDbFunc.queryInput.value.trim();
            let type = queryDbFunc.queryTypeSelect.value.trim();
            let context = queryDbFunc.queryContextInput.value.trim();
            let opts = queryDbFunc.queryOptsInput.value.trim();

            if(!query) query = "{}";
            if(!type) type = "json";
            if(!context) context = "{}";
            if(!opts) opts = "{}";

            switch(type){
                case "js-function":
                    try{
                        (new Function("return " + query))();
                    }catch{
                        return alert("Invalid query context");
                    }
                break;
                case "json5":
                    if(!query.startsWith("{")) query = "{" + query + "}";
                    query = JSON5.parse(query);
                break;
                case "json":
                    query = JSON.parse(query);
                break;
            }

            context = JSON5.parse(context);
            opts = JSON5.parse(opts);
            if(!context) context = {};
            if(!opts) opts = {};
            
            const data = await dbActions.find(query, context, opts);
            if(!data) return;
            db_data = data;
            queryDbFunc.renderData();
        });

        queryDbFunc.queryTypeSelect.addEventListener("change", () => {
            queryDbFunc.queryContextLabel.style.display = queryTypeSelect.value == "js-function" ? "block" : "none";
        });

        document.querySelector("#sortData").addEventListener("click", () => {
            const sortKey = prompt("Enter key to sort by:");
            if(!sortKey) return;
            queryDbFunc.sortData(sortKey);
        });
    },

    sortData(key){
        db_data.sort((a, b) => {
            const aValue = a[key] !== undefined ? a[key] : "";
            const bValue = b[key] !== undefined ? b[key] : "";
            if(aValue > bValue) return 1;
            if(aValue < bValue) return -1;
            return 0;
        });
        this.renderData();
    }
}

queryDbFunc.init();