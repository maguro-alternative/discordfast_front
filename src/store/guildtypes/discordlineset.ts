import { CategoryChannelType,ChannelsType } from "..";

interface LineSetChannels {
    [id:string]:ChannelsType[];
}

export type DiscordLineSetExport = {
    categorys: CategoryChannelType[];
    channels: LineSetChannels;
    threads: {
        id: string;
        name: string;
    }[];
    chengePermission: boolean;
    lineNotifyToken: string;
    lineBotToken: string;
    lineBotSecret: string;
    lineGroupId: string;
    lineClientId: string;
    lineClientSecret: string;
    defalutChannelId: string;
    debugMode: boolean;
}
