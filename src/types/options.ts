export interface DbOpts {
    maxFileSize?: number;
}

export interface DbFindOpts{
    reverse?: boolean;
    max?: number;
}

export interface FindOpts{
    select?: string[];
    exclude?: string[];
    transform?: Function;
}