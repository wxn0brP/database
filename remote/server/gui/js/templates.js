const templatesUtils = {
    load(id){
        const templateEle = document.querySelector("#"+id);
        const html = templateEle.innerHTML;
        const template = Handlebars.compile(html);
        templateEle.remove();
        return template;
    }
}

Handlebars.registerHelper("isObject", function (value){
    return typeof value === "object" && value !== null;
});

Handlebars.registerHelper("json5", function (context){
    const json5 = JSON5.stringify(context, null, 4);
    return json5.substring(1, json5.length - 1);
});

Handlebars.registerHelper("br", function(height){
    return new Handlebars.SafeString(`<div style="height: ${height}px;"></div>`);
});

const templates = {
    databasesList: templatesUtils.load("databases-list-template"),
    databaseNav: templatesUtils.load("database-nav-template"),
    databasesTables: templatesUtils.load("databases-tables-template"),
    tableData: templatesUtils.load("table-data-template"),
    addServer: templatesUtils.load("addServer-template"),
    menageServers: templatesUtils.load("menageServers-template"),
}