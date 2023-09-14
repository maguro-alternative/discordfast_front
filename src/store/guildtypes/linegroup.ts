export type LineLoginExport = {
    pictureUrl:string;
    displayName:string;
    clientId:string;
    redirectEncodeUri:string;
    guildId:string;
}

export type LineGroupExport = {
    categorys:{
        id:string;
        name:string;
    }[];
    channels:{
        [id:string]:{
            id:string;
            name:string;
            type:string;
        }[];
    };
    threads:{
        id:string;
        name:string;
    }[];
    defalutChannelId:string;
    debugMode:boolean;
}