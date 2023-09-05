import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { MultiValue } from "react-select";

import { DiscordWebhook,SelectOption } from '../../../store';

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
        }));
    };

    const handleNewWebhookChange = (
        webhookKind:SelectOption,
        uuid:string
    ) => {
        setWebhookData((prevData) => ({
            ...prevData,
            webhookSet: prevData.webhookSet.map((webhook) => ({
                ...webhook,
                webhook_id: webhook.uuid === uuid ? webhookKind.value : webhook.webhook_id
            })
        )}));
    };

    const handleNewWebhookRoleChange = (
        webhookRoles:MultiValue<SelectOption>,
        uuid:string
    ) => {
        setWebhookData((prevData) => ({
            ...prevData,
            webhookSet: prevData.webhookSet.map((webhook) => ({
                ...webhook,
                mention_roles: webhook.uuid === uuid ? webhookRoles.map((role) => role.value) : webhook.mention_roles
            })
        )}));
    };
    const handleNewWebhookUserChange = (
        webhookUsers:MultiValue<SelectOption>,
        uuid:string
    ) => {
        setWebhookData((prevData) => ({
            ...prevData,
            webhookSet: prevData.webhookSet.map((webhook) => ({
                ...webhook,
                mention_members: webhook.uuid === uuid ? webhookUsers.map((user) => user.value) : webhook.mention_members
            })
        )}));
    };

    const handleNewWebhookInputArray = (
        inputName:string,
        uuid:string,
        popIndex?:number
    ) => {
        if (inputName === "searchOrWord"){
            console.log(inputName,popIndex,webhookData)
            setWebhookData((prevData) => ({
                ...prevData,
                webhookSet: prevData.webhookSet.map((webhook) => ({
                    ...webhook,
                    search_or_word: uuid === webhook.uuid ?
                        popIndex === undefined ? [
                            ...webhook.search_or_word,
                            ""
                        ]:
                        webhook.search_or_word.filter((word,index) => index !== popIndex)
                    :webhook.search_or_word
                })
            )}));
        }else if (inputName === "searchAndWord"){
            setWebhookData((prevData) => ({
                ...prevData,
                webhookSet: prevData.webhookSet.map((webhook) => ({
                    ...webhook,
                    search_and_word: uuid === webhook.uuid ?
                        popIndex === undefined ? [
                            ...webhook.search_and_word,
                            ""
                        ]:
                        webhook.search_and_word.filter((word,index) => index !== popIndex)
                    :webhook.search_and_word
                })
            )}));
        }else if (inputName === "mentionOrWord"){
            setWebhookData((prevData) => ({
                ...prevData,
                webhookSet: prevData.webhookSet.map((webhook) => ({
                    ...webhook,
                    mention_or_word: uuid === webhook.uuid ?
                        popIndex === undefined ? [
                            ...webhook.mention_or_word,
                            ""
                        ]:
                        webhook.mention_or_word.filter((word,index) => index !== popIndex)
                    :webhook.mention_or_word
                })
            )}));
        }else if (inputName === "mentionAndWord"){
            setWebhookData((prevData) => ({
                ...prevData,
                webhookSet: prevData.webhookSet.map((webhook) => ({
                    ...webhook,
                    mention_and_word: uuid === webhook.uuid ?
                        popIndex === undefined ? [
                            ...webhook.mention_and_word,
                            ""
                        ]:
                        webhook.mention_and_word.filter((word,index) => index !== popIndex)
                    :webhook.mention_and_word
                })
            )}));
        }else if (inputName === "ngOrWord"){
            setWebhookData((prevData) => ({
                ...prevData,
                webhookSet: prevData.webhookSet.map((webhook) => ({
                    ...webhook,
                    ng_or_word: uuid === webhook.uuid ?
                        popIndex === undefined ? [
                            ...webhook.ng_or_word,
                            ""
                        ]:
                        webhook.ng_or_word.filter((word,index) => index !== popIndex)
                    :webhook.ng_or_word
                })
            )}));
        }else if (inputName === "ngAndWord"){
            setWebhookData((prevData) => ({
                ...prevData,
                webhookSet: prevData.webhookSet.map((webhook) => ({
                    ...webhook,
                    ng_and_word: uuid === webhook.uuid ?
                        popIndex === undefined ? [
                            ...webhook.ng_and_word,
                            ""
                        ]:
                        webhook.ng_and_word.filter((word,index) => index !== popIndex)
                    :webhook.ng_and_word
                })
            )}));
        }
    }

    const handleNewWebhookInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        /*
        name:入力されたindex
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
                    search_or_word: uuIdReplace === webhook.uuid ? prevData.webhookSet[uuidIndex].search_or_word.map((word,index) => (
                        index === Number(name) ?
                        value : word
                    )) // 新しい値で上書き
                    :webhook.search_or_word
                })),
            }));
        } else if (id.includes("searchAndWord")){
            const uuIdReplace = id.replace("searchAndWord","");
            const uuidIndex = uuids.indexOf(uuIdReplace);
            setWebhookData((prevData) => ({
                ...prevData,
                webhookSet: prevData.webhookSet.map((webhook) => ({
                    ...webhook,
                    search_and_word: uuIdReplace === webhook.uuid ? prevData.webhookSet[uuidIndex].search_and_word.map((word,index) => (
                        index === Number(name) ?
                        value : word
                    )) // 新しい値で上書き
                    :webhook.search_and_word
                })),
            }));
        } else if (id.includes("mentionOrWord")){
            const uuIdReplace = id.replace("mentionOrWord","");
            const uuidIndex = uuids.indexOf(uuIdReplace);
            setWebhookData((prevData) => ({
                ...prevData,
                webhookSet: prevData.webhookSet.map((webhook) => ({
                    ...webhook,
                    mention_or_word: uuIdReplace === webhook.uuid ? prevData.webhookSet[uuidIndex].mention_or_word.map((word,index) => (
                        index === Number(name) ?
                        value : word
                    )) // 新しい値で上書き
                    :webhook.mention_or_word
                })),
            }));
        } else if (id.includes("mentionAndWord")){
            const uuIdReplace = id.replace("mentionAndWord","");
            const uuidIndex = uuids.indexOf(uuIdReplace);
            setWebhookData((prevData) => ({
                ...prevData,
                webhookSet: prevData.webhookSet.map((webhook) => ({
                    ...webhook,
                    mention_and_word: uuIdReplace === webhook.uuid ? prevData.webhookSet[uuidIndex].mention_and_word.map((word,index) => (
                        index === Number(name) ?
                        value : word
                    )) // 新しい値で上書き
                    :webhook.mention_and_word
                })),
            }));
        } else if (id.includes("ngOrWord")){
            const uuIdReplace = id.replace("ngOrWord","");
            const uuidIndex = uuids.indexOf(uuIdReplace);
            setWebhookData((prevData) => ({
                ...prevData,
                webhookSet: prevData.webhookSet.map((webhook) => ({
                    ...webhook,
                    ng_or_word: uuIdReplace === webhook.uuid ? prevData.webhookSet[uuidIndex].ng_or_word.map((word,index) => (
                        index === Number(name) ?
                        value : word
                    )) // 新しい値で上書き
                    :webhook.ng_or_word
                })),
            }));
        } else if (id.includes("ngAndWord")){
            const uuIdReplace = id.replace("ngAndWord","");
            const uuidIndex = uuids.indexOf(uuIdReplace);
            setWebhookData((prevData) => ({
                ...prevData,
                webhookSet: prevData.webhookSet.map((webhook) => ({
                    ...webhook,
                    ng_and_word: uuIdReplace === webhook.uuid ? prevData.webhookSet[uuidIndex].ng_and_word.map((word,index) => (
                        index === Number(name) ?
                        value : word
                    )) // 新しい値で上書き
                    :webhook.ng_and_word
                })),
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
                    handleNewWebhookInputArray={handleNewWebhookInputArray}
                ></CreateNewWebhookSelection>
            </form>
        </>
    )
}

export default Webhook;