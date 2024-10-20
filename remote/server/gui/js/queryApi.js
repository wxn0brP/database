const dbActionUtils = {
    async query(data, path){
        if(!vars.selectedServer) return false;
        if(!vars.selectedDb) return false;
        if(!vars.selectedTable) return false;

        const body = {
            db: vars.selectedDb,
            collection: vars.selectedTable,
            ...data
        }

        const server = serversMeta[vars.selectedServer];
        const res = await fetch(server.url + "db/" + path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": server.token
            },
            body: JSON.stringify(body)
        }).then(res => res.json());
        if(res.err){
            alert(res.msg);
            return false;
        }

        return res.result;
    }
}

const dbActions = {
    async find(query, context=undefined, opts=undefined){
        const body = {
            search: query,
            context,
            opts
        }

        return await dbActionUtils.query(body, "database/find");
    },
}

const graphActions = {
    async find(node){
        return await dbActionUtils.query({ node }, "graph/find");
    },

    async getAll(){
        return await dbActionUtils.query({}, "graph/getAll");
    },
}