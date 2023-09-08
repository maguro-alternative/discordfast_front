export type DiscordWebhookExport = {
    webhooks: {
        id: string;
        name: string;
        channelId: number;
        channelName: string;
    }[];
    guildUsers: {
        id: string;
        name: string;
        userDisplayName: string;
    }[];
    guildRoles: {
        id: string;
        name: string;
    }[];
    chengePermission: boolean;
    webhookSet: {
        uuid:string;
        guild_id:string;
        webhook_id:string;
        subscription_type:string;
        subscription_id:string;
        mention_roles:string[];
        mention_members:string[];
        ng_or_word:string[];
        ng_and_word:string[];
        search_or_word:string[];
        search_and_word:string[];
        mention_or_word:string[];
        mention_and_word:string[];
        created_at:string;
        delete_flag?:boolean;
    }[];
}