import { mkdirSync, cpSync, existsSync, rmSync } from 'fs';
import { join } from 'path';

const guiPath = join("src", "remote", "server", "gui");
console.log("guiPath", guiPath);

function copyGui(buildType){
    const distGuiPath = join("dist", buildType, "remote", "server", "gui");
    console.log("distGuiPath", distGuiPath);
    rmDir(distGuiPath);
    mkdirSync(distGuiPath, { recursive: true });
    cpSync(guiPath, distGuiPath, { recursive: true });
}

function rmDir(path){
    if(existsSync(path)) rmSync(path, { recursive: true });
}

copyGui("esm");
copyGui("cjs");