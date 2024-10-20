const databaseServerList = document.querySelector("#database-server-list");
const data_output = document.querySelector("#data-output");
const queryDivDb = document.querySelector("#query-div-db");
const queryDivGraph = document.querySelector("#query-div-graph");

const renderFunc = {
    renderServerList(){
        const serversList = [];
        Object.keys(serversMeta).forEach(id => {
            serversList.push({
                id,
                name: serversMeta[id].name,
                saved: serversMeta[id].saved || false
            });
        })
        databaseServerList.innerHTML = templates.databasesList({ serversList });

        Object.keys(serversMeta).forEach(id => {
            renderFunc.rednerServer(id);
        })
    },

    async rednerServer(id){
        const server = serversMeta[id];
        if(!server) return;
        const nav = document.querySelector("#database-nav-"+id);
        nav.innerHTML = "";

        const dbsObj = await databaseGetMetaFunc.loadDbList(id);
        const dbsArray = [];
        Object.keys(dbsObj).forEach(db => {
            dbsArray.push({
                serverId: id,
                name: db
            });
        })
        nav.innerHTML = templates.databaseNav({ dbs: dbsArray });
    },

    async renderTables(serverId, dbName){
        const nav = document.querySelector("#database-nav-"+serverId+"-"+dbName);
        nav.innerHTML = "";
        vars.selectedServer = serverId;
        vars.selectedDb = dbName;
        vars.selectedTable = null;
        renderFunc.updateQueryStyle();
        const tables = await databaseGetMetaFunc.getDbTables(serverId, dbName);
        nav.innerHTML = templates.databasesTables({ tables, server: serverId, db: dbName });
    },

    updateQueryStyle(){
        const dbType = getSelectedDatabase().type;
        switch(dbType){
            case "database":
                queryDivDb.style.display = "block";
                queryDivGraph.style.display = "none";
            break;
            case "graph":
                queryDivDb.style.display = "none";
                queryDivGraph.style.display = "block";
            break;
        }
    },
}