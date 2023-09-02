import discordCallbackResponse from "./typejsons/discordtype.json"
import discordOAuthResponse from "./typejsons/discordoauthtoken.json"
import discordGuilds from './typejsons/discordguild.json'
import discordGuildID from './typejsons/discordguildid.json'
import discordAdmin from './typejsons/discordadminper.json'
import discordLineSet from './typejsons/discordlineset.json'
import discordVcSignal from './typejsons/discordvcsignal.json'
import discordWebhook from './typejsons/discordwebhook.json'
import lineGroup from './typejsons/linegroup.json'
import { type } from "os"

export type DiscordCallbackResponse = typeof discordCallbackResponse
export type DiscordOAuthResponse = typeof discordOAuthResponse
export type DiscordGuilds = typeof discordGuilds
export type DiscordGuildID = typeof discordGuildID
export type DiscordAdmin = typeof discordAdmin
//export type DiscordVcSignal = typeof discordVcSignal
export type DiscordWebhook = typeof discordWebhook
export type LineGroup = typeof lineGroup

export interface SelectOption {
    value:string,
    label:string
};

export interface VcSignalChannel {
    id: string;
    name: string;
    sendChannelId:string;
    sendSignal:boolean;
    everyoneMention:boolean;
    joinBot:boolean;
    mentionRoleId:string[];
}

export interface VcSignalChannels {
    [id:string]:VcSignalChannel[];
}

export interface LinePostChannel {
    id: string;
    name: string;
    type: string;
    lineNgChannel: boolean;
    ngMessageType: string[];
    messageBot: boolean;
    ngUsers: string[];
}

export interface LinePostChannels {
    [id:string]:LinePostChannel[];
}

export interface LineSetChannel {
    id: string;
    name: string;
    type: string;
}

export interface LineSetChannels {
    [id:string]:LineSetChannel[];
}

export interface CategoryChannelType {
    id:string;
    name:string;
}

export type DiscordVcSignal = {
    categorys: CategoryChannelType[];
    channels: LineSetChannels;
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

export type DiscordLinePost = {
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

export type DiscordLineSet = {
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