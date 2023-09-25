import { CategoryChannelType, ChannelsType } from "..";

interface VcSignalChannel {
    id: string;
    name: string;
    sendChannelId:string;
    sendSignal:boolean;
    everyoneMention:boolean;
    joinBot:boolean;
    mentionRoleId:string[];
}

interface VcSignalChannels {
    [id:string]:VcSignalChannel[];
}

export type DiscordVcSignalExport = {
    guildIcon:string;
    guildName:string;
    categorys: CategoryChannelType[];
    channels: {
        [id:string]:ChannelsType[]
    };
    threads: {
        id: string;
        name: string;
        type: string;
    }[];
    vcChannels:VcSignalChannels;
    users: {
        id: string;
        name: string;
        userDisplayName: string;
    }[];
    roles: {
        id:string;
        name:string;
    }[];
    chengePermission: boolean;
}
