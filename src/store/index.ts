import discordCallbackResponse from "./typejsons/discordtype.json"
import discordOAuthResponse from "./typejsons/discordoauthtoken.json"
import discordGuilds from './typejsons/discordguild.json'
import discordGuildID from './typejsons/discordguildid.json'

import lineGroup from './typejsons/linegroup.json'

import { DiscordAdminExport } from "./guildtypes/discordadmin"
import { DiscordLineSetExport } from "./guildtypes/discordlineset"
import { DiscordLinePostExport, LinePostDataExport } from "./guildtypes/discordlinepost"
import { DiscordVcSignalExport } from "./guildtypes/discordvcsignal"
import { DiscordWebhookExport } from "./guildtypes/discordwebhook"

export type DiscordCallbackResponse = typeof discordCallbackResponse
export type DiscordOAuthResponse = typeof discordOAuthResponse
export type DiscordGuilds = typeof discordGuilds
export type DiscordGuildID = typeof discordGuildID
export type DiscordAdmin = DiscordAdminExport
export type DiscordLineSet = DiscordLineSetExport
export type DiscordLinePost = DiscordLinePostExport
export type LinePostData = LinePostDataExport
export type DiscordVcSignal = DiscordVcSignalExport
export type DiscordWebhook = DiscordWebhookExport
export type LineGroup = typeof lineGroup

export interface SelectOption {
    value:string,
    label:string
};

export interface ChannelsType {
    id: string;
    name: string;
    type: string;
}

export interface CategoryChannelType {
    id:string;
    name:string;
}