function loadHTML(){
    const templateDiv = document.querySelector("#templates");
    const appDiv = document.querySelector("#app");
    [
        "data",
        "nav",
        "popup",
    ].forEach(file => {
        const html = cw.get(`html/${file}.html`);
        templateDiv.innerHTML += html;
    });

    appDiv.innerHTML += cw.get("html/main.html");
}

loadHTML();