import discordCallbackResponse from "./typejsons/discordtype.json"
import discordOAuthResponse from "./typejsons/discordoauthtoken.json"
import discordGuilds from './typejsons/discordguild.json'
import discordGuildID from './typejsons/discordguildid.json'
import discordAdmin from './typejsons/discordadminper.json'
import discordLinePost from './typejsons/discordlinepost.json'
import discordLineSet from './typejsons/discordlineset.json'
import discordVcSignal from './typejsons/discordvcsignal.json'
import discordWebhook from './typejsons/discordwebhook.json'
import lineGroup from './typejsons/linegroup.json'

export type DiscordCallbackResponse = typeof discordCallbackResponse
export type DiscordOAuthResponse = typeof discordOAuthResponse
export type DiscordGuilds = typeof discordGuilds
export type DiscordGuildID = typeof discordGuildID
export type DiscordAdmin = typeof discordAdmin
export type DiscordLinePost = typeof discordLinePost
export type DiscordLineSet = typeof discordLineSet
export type DiscordVcSignal = typeof discordVcSignal
export type DiscordWebhook = typeof discordWebhook
export type LineGroup = typeof lineGroup

export interface SelectOption {
    value:string,
    label:string
};