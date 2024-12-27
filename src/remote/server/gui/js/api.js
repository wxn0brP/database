const databaseGetMetaFunc = {
    async loadDbList(serverId){
        const server = serversMeta[serverId];
        if(!server) return;
        const res = await fetch(server.url + "getDbList", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": server.token
            },
        }).then(res => res.json());
    
        if(res.err){
            alert(res.msg);
            return;
        }
        serversData[serverId] = {};
        const dbObj = serversData[serverId];
        res.result.forEach(db => {
            dbObj[db.name] = {
                collections: [],
                type: db.type
            };
        });
        return dbObj;
    },
    
    async loginToDb(serverUrl, serverName, login, password){
        if(!serverUrl.endsWith("/")) serverUrl += "/";
        const res = await fetch(serverUrl + "login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ login, password })
        }).then(res => res.json());
        if(res.err){
            alert(res.msg);
            return false;
        }
    
        const id = Object.keys(serversMeta).length + 1;
        serversMeta[id] = {
            url: serverUrl,
            token: res.token,
            name: serverName,
            login
        }
        return id;
    },

    async getDbTables(serverId, dbName){
        const server = serversMeta[serverId];
        if(!server) return;
    
        const res = await fetch(server.url + "db/" + getSelectedDatabase().type + "/getCollections", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": server.token
            },
            body: JSON.stringify({ db: dbName })
        }).then(res => res.json());
        if(res.err){
            alert(res.msg);
            return;
        }
    
        serversData[serverId][dbName].collections = res.result;
        return res.result;
    },
    
    getAll(){
        const out = [];
        Object.keys(serversMeta).forEach(id => {
            const server = serversMeta[id];
            out.push({
                id,
                name: server.name,
                saved: server.saved,
                url: server.url,
                login: server.login,
            })
        });

        const savedServers = JSON.parse(localStorage.getItem("servers") || "[]");
        savedServers.forEach(server => {
            if(out.find(s => s.name == server.name)) return;
            out.push({
                id: -1,
                name: server.name,
                url: server.url,
                saved: true,
            })
        });

        return out;
    }
}

const storageControler = {
    addServerStorage(id){
        let servers = JSON.parse(localStorage.getItem("servers") || "[]");
        const server = serversMeta[id];
        if(!server.url.endsWith("/")) server.url += "/";
        servers.push({
            name: server.name,
            url: server.url,
        });
        servers.sort((a, b) => a.name.localeCompare(b.name));
        localStorage.setItem("servers", JSON.stringify(servers));
    },
    
    removeServerStorage(serverId, serverData=null){
        let servers = JSON.parse(localStorage.getItem("servers"));
        if(!servers) servers = [];
        const server = serverData || serversMeta[serverId];
        server.saved = false;

        const index = servers.findIndex(({ name, url }) => name == server.name && url == server.url);
        if(index > -1) servers.splice(index, 1);

        localStorage.setItem("servers", JSON.stringify(servers));
    },
    
    async getServersFromStorage(){
        let servers = JSON.parse(localStorage.getItem("servers"));
        if(!servers) return;
        
        for(let server of servers){
            const serverId = await popupFunc.addServer(server);
            if(serverId){
                serversMeta[serverId].saved = true;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        renderFunc.renderServerList();
    },
}

const menageServers = {
    toggleServer(id, name="", url=""){
        let server = serversMeta[id];
        if(!server){
            if(id != -1) return;
            const servers = JSON.parse(localStorage.getItem("servers") || "[]");
            if(!servers) return;
            storageControler.removeServerStorage(-1, { name, url });
            document.querySelector("#popUpContainer #menageServers #cancel-btn").click();
            setTimeout(() => {
                popupFunc.showMgmtServers();
            }, 1000);
            return;
        }

        if(server.saved){
            storageControler.removeServerStorage(id);
            server.saved = false;
            document.querySelector("#menageServers__" + id).innerHTML = "Add to saved";
        }else{
            storageControler.addServerStorage(id);
            server.saved = true;
            document.querySelector("#menageServers__" + id).innerHTML = "Remove from saved";
        }
    }
}