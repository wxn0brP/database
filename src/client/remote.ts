export interface Remote {
    name: string;
    url: string;
    auth: string;
}

export interface RequestData{
    collection?: string;
    db?: string;
    keys?: string[];
    // any kay and value
    [key: string]: any; 
}

export interface findOptsRemote{
    select?: string[]
    exclude?: string[]
    transform?: string
}
