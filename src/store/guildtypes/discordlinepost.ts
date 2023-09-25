import { CategoryChannelType } from "..";

interface LinePostChannel {
    id: string;
    name: string;
    type: string;
    lineNgChannel: boolean;
    ngMessageType: string[];
    messageBot: boolean;
    ngUsers: string[];
}

interface LinePostChannels {
    [id:string]:LinePostChannel[];
}
export interface LinePostDataExport {
    channels: {
        [key: string]: LinePostChannel[]; // インデックスシグネチャを使用
    };
    threads: LinePostChannel[];
}


export type DiscordLinePostExport = {
    guildIcon:string;
    guildName:string;
    categorys: CategoryChannelType[];
    channels: LinePostChannels;
    threads: {
        id: string;
        name: string;
        type: string;
        lineNgChannel: boolean;
        ngMessageType: string[];
        messageBot: boolean;
        ngUsers: string[];
    }[];
    users: {
        id: string;
        name: string;
        userDisplayName: string;
    }[];
    chengePermission: boolean;
}