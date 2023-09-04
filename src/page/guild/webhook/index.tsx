import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { DiscordWebhook } from '../../../store';

import CreateNewWebhookSelection from "./CreateNewWebhook";

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
                guild_id: "",
                webhook_id: "",
                subscription_type: "twitter",
                subscription_id: "sigumataityouda",
                mention_roles: [""],
                mention_members: [""],
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

    const newWebhookSetting = () => {
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

    const handleNewWebhookChange = () => {};

    const handleNewWebhookRoleChange = () => {};
    const handleNewWebhookUserChange = () => {};

    const handleNewWebhookInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        /*
        name:検索用語
        value:キーワード
        */
        const { name, value, type, id } = e.target;
        const uuids = webhookData.webhookSet.map((webhook) => {
            return webhook.uuid;
        })
        console.log(value,webhookData);
        if (id.includes("searchOrWord")){
            const uuIdReplace = id.replace("searchOrWord","");
            const uuidIndex = uuids.indexOf(uuIdReplace);
            setWebhookData((prevData) => ({
                ...prevData,
                webhookSet: prevData.webhookSet.map((webhook) => ({
                    ...webhook,
                    search_or_word: prevData.webhookSet[uuidIndex].search_or_word.map((words,index) => (
                        index === Number(name) ?
                        value : words[index]
                    )) // 新しい値で上書き
                })),
            }));
        } else if (id.includes("searchAndWord")){
            const idReplace = id.replace("searchAndWord","");
            const uuidIndex = uuids.indexOf(idReplace);
            setWebhookData((prevData) => ({
                ...prevData,
                search_and_word:[
                    ...prevData.webhookSet[uuidIndex].search_and_word,
                    value
                ]
            }));
        } else if (id.includes("mentionOrWord")){
            const idReplace = id.replace("mentionOrWord","");
            const uuidIndex = uuids.indexOf(idReplace);
            setWebhookData((prevData) => ({
                ...prevData,
                mention_or_word:[
                    ...prevData.webhookSet[uuidIndex].mention_or_word,
                    value
                ]
            }));
        } else if (id.includes("mentionAndWord")){
            const idReplace = id.replace("mentionAndWord","");
            const uuidIndex = uuids.indexOf(idReplace);
            setWebhookData((prevData) => ({
                ...prevData,
                mention_and_word:[
                    ...prevData.webhookSet[uuidIndex].mention_and_word,
                    value
                ]
            }));
        } else if (id.includes("ngOrWord")){
            const idReplace = id.replace("ngOrWord","");
            const uuidIndex = uuids.indexOf(idReplace);
            setWebhookData((prevData) => ({
                ...prevData,
                ng_or_word:[
                    ...prevData.webhookSet[uuidIndex].ng_or_word,
                    value
                ]
            }));
        } else if (id.includes("ngAndWord")){
            const idReplace = id.replace("ngAndWord","");
            const uuidIndex = uuids.indexOf(idReplace);
            setWebhookData((prevData) => ({
                ...prevData,
                ng_and_word:[
                    ...prevData.webhookSet[uuidIndex].ng_and_word,
                    value
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
                newWebhookSetting();
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
            <form>
                <CreateNewWebhookSelection
                    newUuids={newUuids}
                    webhookSet={webhookData}
                    newWebhookSetting={newWebhookSetting}
                    handleNewWebhookChange={handleNewWebhookChange}
                    handleNewWebhookRoleChange={handleNewWebhookRoleChange}
                    handleNewWebhookUserChange={handleNewWebhookUserChange}
                    handleNewWebhookInputChange={handleNewWebhookInputChange}
                ></CreateNewWebhookSelection>
            </form>
        </>
    )
}

export default Webhook;