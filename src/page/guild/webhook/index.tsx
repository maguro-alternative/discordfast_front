import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { MultiValue } from "react-select";

import { DiscordWebhook,SelectOption } from '../../../store';
import Headmeta from "../../../components/headmeta";
import CreateNewWebhookSelection from "./CreateNewWebhook";
import UpdateWebhookSelection from "./UpdateWebhook";

const Webhook = () => {
    const { id } = useParams(); // パラメータを取得

    const [webhookData, setWebhookData] = useState<DiscordWebhook>({
        guildIcon: "",
        guildName: "",
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
    const [isLoading, setIsLoading] = useState(true);   // ロード中かどうか
    const [newUuids, setNewUuids] = useState<string[]>([uuidv4().toString()]);  // 新しく追加するwebhookのuuid
    const [updateUuids,setUpdateUuids] = useState<string[]>([]);    // 更新するwebhookのuuid

    const newWebhookSetting = () => {
        /*
        新しくwebhookでの投稿内容を追加する
        */
        const newUuid = uuidv4().toString();    // uuidを生成
        const guildId = id && id !== undefined ? id : ''
        setNewUuids([   // uuidを追加
            ...newUuids,
            newUuid
        ]);
        setWebhookData((prevData) => ({ //webhookの初期値を追加
            ...prevData,
            webhookSet:[
                ...prevData.webhookSet,
                {
                    uuid:newUuid,
                    guild_id:guildId,
                    webhook_id: "",
                    subscription_type: "",
                    subscription_id: "",
                    mention_roles: [],
                    mention_members: [],
                    ng_or_word: [],
                    ng_and_word: [],
                    search_or_word: [],
                    search_and_word: [],
                    mention_or_word: [],
                    mention_and_word: [],
                    created_at: "Wed Jun 14 00:01:27 +0000 2023"
                }
            ]
        }));
    };

    const handleDeleteWebhookCheckboxChange = (
        uuid:string,
        checkState:boolean
    ) => {
        const uuids = webhookData.webhookSet.map((webhook) => {
            return webhook.uuid;
        })
        const uuidIndex = uuids.indexOf(uuid);   // uuidのindex番号を取得
        setWebhookData((prevData) => ({
            ...prevData,
            webhookSet: prevData.webhookSet.map((webhook) => ({
                ...webhook,
                delete_flag:uuid === webhook.uuid && checkState
            })),
        }));
    };

    const handleWebhookChange = (
        webhookKind:SelectOption,
        uuid:string
    ) => {
        /*
        サーバー内のwebhook一覧から選択されたwebhookを格納する

        webhookKind:webhookの種類
        uuid:uuid
        */
        setWebhookData((prevData) => ({
            ...prevData,
            webhookSet: prevData.webhookSet.map((webhook) => ({
                ...webhook,
                webhook_id: webhook.uuid === uuid ? webhookKind.value : webhook.webhook_id
            })
        )}));
    };

    const handleWebhookRoleChange = (
        webhookRoles:MultiValue<SelectOption>,
        uuid:string
    ) => {
        /*
        サーバー内のロール一覧から選択されたロールを格納する

        webhookRoles:ロール一覧
        uuid:uuid
        */
        setWebhookData((prevData) => ({
            ...prevData,
            webhookSet: prevData.webhookSet.map((webhook) => ({
                ...webhook,
                mention_roles: webhook.uuid === uuid ? webhookRoles.map((role) => role.value) : webhook.mention_roles
            })
        )}));
    };
    const handleWebhookUserChange = (
        webhookUsers:MultiValue<SelectOption>,
        uuid:string
    ) => {
        /*
        サーバー内のユーザー一覧から選択されたユーザーを格納する

        webhookUsers:ユーザー一覧
        uuid:uuid
        */
        setWebhookData((prevData) => ({
            ...prevData,
            webhookSet: prevData.webhookSet.map((webhook) => ({
                ...webhook,
                mention_members: webhook.uuid === uuid ? webhookUsers.map((user) => user.value) : webhook.mention_members
            })
        )}));
    };

    const handleWebhookInputArray = (
        inputName:string,
        uuid:string,
        popIndex?:number
    ) => {
        /*
        ボタンがクリックされた場合、textタグの項目追加、削除を行う

        inputName:追加、削除する項目の名前
        uuid:uuid
        popIndex:削除する項目の番号(配列名、含まれない場合追加と判断)
        */
        if (inputName === "searchOrWord"){
            setWebhookData((prevData) => ({
                ...prevData,
                webhookSet: prevData.webhookSet.map((webhook) => ({
                    ...webhook,
                    search_or_word: uuid === webhook.uuid ? // uuidと一致する項目があった場合
                        popIndex === undefined ? [  // popIndexが含まれない場合、追加
                            ...webhook.search_or_word,
                            ""
                        ]:
                        webhook.search_or_word.filter((word,index) => index !== popIndex)   // popIndexが含まれる場合、削除
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

    const handleWebhookInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        /*
        テキストボックスの内容を変更する

        name:入力されたindex番号(配列の番号)
        value:入力された値
        id:入力された項目の名前 {項目名}{uuid}で構成される
        */
        const { name, value, id } = e.target;
        const uuids = webhookData.webhookSet.map((webhook) => {
            return webhook.uuid;
        })
        //console.log(value,webhookData);
        if (id.includes("subscType")){
            const uuIdReplace = id.replace("subscType","");  // 項目名を削除
            setWebhookData((prevData) => ({
                ...prevData,
                webhookSet: prevData.webhookSet.map((webhook) => ({
                    ...webhook,
                    subscription_type: uuIdReplace === webhook.uuid ?
                    value : webhook.subscription_type // uuidが一致した場合、新しい値で上書き
                })),
            }));
        } else if (id.includes("subscId")){
            const uuIdReplace = id.replace("subscId","");  // 項目名を削除
            setWebhookData((prevData) => ({
                ...prevData,
                webhookSet: prevData.webhookSet.map((webhook) => ({
                    ...webhook,
                    subscription_id: uuIdReplace === webhook.uuid ?
                    value : webhook.subscription_id // uuidが一致した場合、新しい値で上書き
                })),
            }));
        } else if (id.includes("searchOrWord")){
            const uuIdReplace = id.replace("searchOrWord","");  // 項目名を削除
            const uuidIndex = uuids.indexOf(uuIdReplace);   // uuidのindex番号を取得
            setWebhookData((prevData) => ({
                ...prevData,
                webhookSet: prevData.webhookSet.map((webhook) => ({
                    ...webhook,
                    search_or_word: uuIdReplace === webhook.uuid ? prevData.webhookSet[uuidIndex].search_or_word.map((word,index) => (  // uuidが一致した場合
                        index === Number(name) ?    // index番号が一致した場合
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
                const response = await axios.get<DiscordWebhook>(   // サーバーからデータを取得
                    `${SERVER_BASE_URL}/guild/${id}/webhook/view`,
                    { withCredentials: true }
                );
                const responseData = response.data;
                //console.log(responseData);
                setWebhookData(responseData);   // webhookのデータを格納
                setUpdateUuids(responseData.webhookSet.map((webhook) => webhook.uuid));    // 更新用のuuidを格納
                newWebhookSetting();    // webhookの初期値を追加
                setIsLoading(false); // データ取得完了後にローディングを解除
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

    const handleFormSubmit = async(e: React.FormEvent) => {
        /*
        送信ボタンを押したときの処理
        */
        e.preventDefault();
        if(webhookData){
            //console.log(webhookData);
            const webhookList = webhookData.webhookSet.filter((webhook) => {
                if(webhook.webhook_id !== "" &&
                    webhook.subscription_id !== "" &&
                    webhook.subscription_type !== "" &&
                    webhook.guild_id !== ""
                ){  // webhook_id,subscription_id,guild_idが空でない場合
                    return {
                        uuid:webhook.uuid,
                        webhook_id:webhook.webhook_id,
                        subscription_type:webhook.subscription_type,
                        subscription_id:webhook.subscription_id,
                        mention_roles:webhook.mention_roles,
                        mention_members:webhook.mention_members,
                        ng_or_word:webhook.ng_or_word,
                        ng_and_word:webhook.ng_and_word,
                        search_or_word:webhook.search_or_word,
                        search_and_word:webhook.search_and_word,
                        mention_or_word:webhook.mention_or_word,
                        mention_and_word:webhook.mention_and_word,
                        delete_flag:webhook.delete_flag
                    }
                }
            })
            const json = {
                guild_id:id,
                webhook_list:webhookList
            }
            // json文字列に変換(guild_id)はstrに変換
            const jsonData = JSON.stringify(json,(key, value) => {
                if (typeof value === 'bigint') {
                    return value.toString();
                }
                return value;
            });
            //console.log(webhookData,JSON.parse(jsonData));
            let check = window.confirm('送信します。よろしいですか？');
            if (check) {
                // サーバー側に送信
                const webhookJson = await axios.post(
                    `${SERVER_BASE_URL}/api/webhook-success-json`,
                    JSON.parse(jsonData),
                    { withCredentials: true }
                )// 通信が成功したときに返ってくる
                .then(function () {
                    alert('送信完了!');
                    window.location.href = `/guild/${id}`;
                })
                // 通信が失敗したときに返ってくる
                .catch(function (error) {
                    alert(error);
                });
            }
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    } else {
        return(
            <>
                <Headmeta
                    title={`${webhookData.guildName}のWebhook設定`}
                    description="Webhook"
                    orginUrl={window.location.href}
                    iconUrl={webhookData.guildIcon ? (
                        `https://cdn.discordapp.com/icons/${id}/${webhookData.guildIcon}.png`
                    ):(
                        `../../images/discord-icon.jpg`
                    )}
                />
                <a href={`/guild/${id}`}>
                    {webhookData.guildIcon ? (
                        <img
                            src={`https://cdn.discordapp.com/icons/${id}/${webhookData.guildIcon}.png`}
                            alt="ギルドアイコン"
                        />
                    ):(
                        <img
                            src={`../../images/discord-icon.jpg`}
                            alt="ギルドアイコン"
                        />
                    )}
                    <h3>{webhookData.guildName}</h3>
                </a>
                <h1>WebHookの送信設定</h1>
                <h4>動画サイトなどの投稿があれば通知します。</h4>
                <form onSubmit={handleFormSubmit}>
                    <CreateNewWebhookSelection
                        newUuids={newUuids}
                        webhookSet={webhookData}
                        newWebhookSetting={newWebhookSetting}
                        handleNewWebhookChange={handleWebhookChange}
                        handleNewWebhookRoleChange={handleWebhookRoleChange}
                        handleNewWebhookUserChange={handleWebhookUserChange}
                        handleNewWebhookInputChange={handleWebhookInputChange}
                        handleNewWebhookInputArray={handleWebhookInputArray}
                    ></CreateNewWebhookSelection>
                    <UpdateWebhookSelection
                        updateUuids={updateUuids}
                        webhookSet={webhookData}
                        handleUpdateWebhookChange={handleWebhookChange}
                        handleUpdateWebhookRoleChange={handleWebhookRoleChange}
                        handleUpdateWebhookUserChange={handleWebhookUserChange}
                        handleUpdateWebhookInputChange={handleWebhookInputChange}
                        handleUpdateWebhookInputArray={handleWebhookInputArray}
                        handleDeleteWebhookCheckboxChange={handleDeleteWebhookCheckboxChange}
                    ></UpdateWebhookSelection>
                    <a
                        href={`/guild/${id}`}
                        className="blue-btn"
                    >前のページに戻る</a>
                    <br/>
                    {webhookData.chengePermission ? (
                        <button type="submit">Submit</button>
                    ):(
                        <></>
                    )}
                </form>
            </>
        )
    }
}

export default Webhook;