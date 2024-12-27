const navPos = document.querySelector("nav");

function selectTable(server, db, table){
    vars.selectedServer = server;
    vars.selectedDb = db;
    vars.selectedTable = table;
    renderFunc.updateQueryStyle();
}

new AutoUpdater(vars, "selectedServer", "#selected-server", data => data ? serversMeta[data]?.name + " >" : "-");
new AutoUpdater(vars, "selectedDb", "#selected-database", data => data ? data + " >" : "-");
new AutoUpdater(vars, "selectedTable", "#selected-table", data => data ? data : "-");

document.querySelector("#nav__toggle").addEventListener("click", () => {
    navPos.style.left = navPos.style.left == "0px" ? "-" +navPos.clientWidth + "px" : "0px";
});
storageControler.getServersFromStorage().then(renderFunc.renderServerList);