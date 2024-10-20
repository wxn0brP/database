import crypto from "crypto";
import os from "os";

function generateJwtSecret(){
    const hostname = os.hostname();
    const cpuModels = os.cpus().map(cpu => cpu.model).join("-");
    const platform = os.platform();
    const arch = os.arch();
    const macAddresses = os.networkInterfaces();

    const macAddress = Object.values(macAddresses)
        .flat()
        .filter(iface => iface.mac !== "00:00:00:00:00:00" && !iface.internal)
        .map(iface => iface.mac)
        .join("-");

    const secretData = `${hostname}-${cpuModels}-${platform}-${arch}-${macAddress}`;
    return crypto.createHash("sha256").update(secretData).digest("hex");
}

export default function getSecret(){
    return process.env.JWT || generateJwtSecret();
}