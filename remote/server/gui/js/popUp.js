const popupDiv = document.querySelector("#popUpContainer");

const popupFunc = {
    async addServer(data={}){
        return new Promise((resolve, reject) => {
            let { url, name, login, pass } = data;
            const popup = document.createElement("div");
            popup.id = "addServer";
            popup.innerHTML = templates.addServer(data);
    
            const urlInput = popup.querySelector("#url");
            const nameInput = popup.querySelector("#name");
            const loginInput = popup.querySelector("#login");
            const passInput = popup.querySelector("#pass");
            urlInput.value = url || "";
            nameInput.value = name || "";
            loginInput.value = login || "";
            passInput.value = pass || "";
    
            async function loginFunc(){
                url = urlInput.value;
                name = nameInput.value;
                login = loginInput.value;
                pass = passInput.value;
                if(!url || !name || !login || !pass){
                    alert("All fields are required");
                    return;
                }
                const serverId = await databaseGetMetaFunc.loginToDb(url, name, login, pass);
                if(!serverId) return;
                
                resolve(serverId);
                popup.fadeOut(() => popup.remove());
            }

            popup.querySelector("#login-btn").addEventListener("click", loginFunc);
            passInput.addEventListener("keydown", (e) => {
                if(e.key == "Enter") loginFunc();
            });
    
            popup.querySelector("#cancel-btn").addEventListener("click", () => {
                resolve(false);
                popup.fadeOut(() => popup.remove());
            });
    
            popupDiv.appendChild(popup);
            popup.fadeIn();
        });
    },

    async showAddServer(){
        const res = await popupFunc.addServer();
        if(!res) return;
        renderFunc.renderServerList();
        document.querySelector("#popUpContainer #menageServers #cancel-btn").click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        popupFunc.showMgmtServers();
    },

    showMgmtServers(){
        const div = document.createElement("div");
        div.id = "menageServers";
        const servers = databaseGetMetaFunc.getAll();
        div.innerHTML = templates.menageServers({ serversList: servers });
        popupDiv.appendChild(div);
        div.fadeIn();

        div.querySelector("#cancel-btn").addEventListener("click", () => {
            div.fadeOut(() => div.remove());
        });
    }
}