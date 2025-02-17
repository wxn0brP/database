export interface Remote {
    name: string;
    url: string;
    auth: string;
}

export interface RequestData {
    db?: string;
    keys?: string[];
    params?: Record<string, any>;
}

export interface findOptsRemote {
    select?: string[]
    exclude?: string[]
    transform?: string
}
