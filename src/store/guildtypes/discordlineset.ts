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

export type DiscordLineSetSubmitDataExport = {
    guild_id:string | undefined
    line_notify_token?:string
    line_bot_token?:string
    line_bot_secret?:string
    line_group_id?:string
    line_client_id?:string
    line_client_secret?:string
    line_notify_token_del_flag?:boolean
    line_bot_token_del_flag?:boolean
    line_bot_secret_del_flag?:boolean
    line_group_id_del_flag?:boolean
    line_client_id_del_flag?:boolean
    line_client_secret_del_flag?:boolean
    default_channel_id?:string
    debug_mode:boolean
}