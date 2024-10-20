import path from "path";

export function isPathSafe(baseDir, userPath){
    const resolvedBase = path.resolve(baseDir);
    const resolvedUserPath = path.resolve(baseDir, userPath);
    return resolvedUserPath.startsWith(resolvedBase + path.sep);
}