import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { DiscordWebhook } from '../../../store';

const Webhook = () => {
    const { id } = useParams(); // パラメータを取得

    const [webhookData, setWebhookData] = useState<DiscordWebhook>({
        webhooks: [
            {
                id: "123456789012345678",
                name: "Spidey Bot",
                channelId: 0,
                channelName: ""
            }
        ],
        guildUsers: [
            {
                id: "123456789012345678",
                name: "",
                userDisplayName: ""
            }
        ],
        guildRoles: [
            {
                id: "123456789012345678",
                name: "@everyone"
            }
        ],
        chengePermission: false,
        webhookSet: [
            {
                uuid: "b0389d11-5485-4c10-b510-1019fe667601",
                guild_id: "123456789012345678",
                webhook_id: "123456789012345678",
                subscription_type: "twitter",
                subscription_id: "sigumataityouda",
                mention_roles: ["123456789012345678"],
                mention_members: ["123456789012345678"],
                ng_or_word: [""],
                ng_and_word: [""],
                search_or_word: [""],
                search_and_word: [""],
                mention_or_word: [""],
                mention_and_word: [""],
                created_at: "Wed Jun 14 00:01:27 +0000 2023"
            }
        ]
    });
    const [newUuids, setNewUuids] = useState<string[]>([uuidv4().toString()]);

    const addNewWebhookUuid = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUuid = uuidv4().toString();
        const guildId = id && id !== undefined ? id : ''
        setNewUuids([
            ...newUuids,
            newUuid
        ]);
        setWebhookData((prevData) => ({
            ...prevData,
            webhookSet:[
                ...prevData.webhookSet,
                {
                    uuid:newUuid,
                    guild_id:guildId,
                    webhook_id: "123456789012345678",
                    subscription_type: "twitter",
                    subscription_id: "sigumataityouda",
                    mention_roles: ["123456789012345678"],
                    mention_members: ["123456789012345678"],
                    ng_or_word: [""],
                    ng_and_word: [""],
                    search_or_word: [""],
                    search_and_word: [""],
                    mention_or_word: [""],
                    mention_and_word: [""],
                    created_at: "Wed Jun 14 00:01:27 +0000 2023"
                }
            ]
        }));
    };

    const handleNewWebhookInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        /*
        name:検索用語
        */
        const { name, value, type, id } = e.target;
        const uuids = webhookData.webhookSet.map((webhook) => {
            return webhook.uuid;
        })
        if (id.includes("searchOrWord")){
            const idReplace = id.replace("searchOrWord","");
            const uuidIndex = uuids.indexOf(idReplace);
            setWebhookData((prevData) => ({
                ...prevData,
                search_or_word:[
                    ...prevData.webhookSet[uuidIndex].search_or_word,
                    name
                ]
            }));
        } else if (id.includes("searchAndWord")){
            const idReplace = id.replace("searchAndWord","");
            const uuidIndex = uuids.indexOf(idReplace);
            setWebhookData((prevData) => ({
                ...prevData,
                search_and_word:[
                    ...prevData.webhookSet[uuidIndex].search_and_word,
                    name
                ]
            }));
        } else if (id.includes("mentionOrWord")){
            const idReplace = id.replace("mentionOrWord","");
            const uuidIndex = uuids.indexOf(idReplace);
            setWebhookData((prevData) => ({
                ...prevData,
                mention_or_word:[
                    ...prevData.webhookSet[uuidIndex].mention_or_word,
                    name
                ]
            }));
        } else if (id.includes("mentionAndWord")){
            const idReplace = id.replace("mentionAndWord","");
            const uuidIndex = uuids.indexOf(idReplace);
            setWebhookData((prevData) => ({
                ...prevData,
                mention_and_word:[
                    ...prevData.webhookSet[uuidIndex].mention_and_word,
                    name
                ]
            }));
        } else if (id.includes("ngOrWord")){
            const idReplace = id.replace("ngOrWord","");
            const uuidIndex = uuids.indexOf(idReplace);
            setWebhookData((prevData) => ({
                ...prevData,
                ng_or_word:[
                    ...prevData.webhookSet[uuidIndex].ng_or_word,
                    name
                ]
            }));
        } else if (id.includes("ngAndWord")){
            const idReplace = id.replace("ngAndWord","");
            const uuidIndex = uuids.indexOf(idReplace);
            setWebhookData((prevData) => ({
                ...prevData,
                ng_and_word:[
                    ...prevData.webhookSet[uuidIndex].ng_and_word,
                    name
                ]
            }));
        }
    };

    const SERVER_BASE_URL = process.env.REACT_APP_SERVER_URL
    useEffect(() => {
        let ignore = false;
        async function fetchData() {
            try {
                const response = await axios.get<DiscordWebhook>(
                    `${SERVER_BASE_URL}/guild/${id}/webhook/view`,
                    { withCredentials: true }
                );
                const responseData = response.data;
                console.log(responseData);
                setWebhookData(responseData);
            } catch (error: unknown) {
                console.error('ログインに失敗しました。 -', error);
                //throw new Error('ログインに失敗しました。 - ', error);
            }
        }
        if (!ignore){
            fetchData();
        }
        return () => {
            ignore = true;
        };
    },[]);

    return(
        <>
            <form></form>
        </>
    )
}

export default Webhook;