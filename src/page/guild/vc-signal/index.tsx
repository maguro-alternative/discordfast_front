import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { MultiValue } from "react-select";
import axios from 'axios';

import {
    DiscordVcSignal,
    SelectOption
} from '../../../store';
import VcChannelSelection from "./VcChannelSelection";

const VcSignal = () => {
    const { id } = useParams(); // パラメータを取得

    const [vcSignalData, setVcSignalData] = useState<DiscordVcSignal>();
    const [isLoading, setIsLoading] = useState(true);   // ロード中かどうか

    const vcChannelSelect = (
        vcChannelSelect:SelectOption,
        categoryId:string,
        channelId:string
    ) => {
        /*
        セレクトボックスの値が変更されたら、vcChannelsのsendChannelIdを更新する

        vcChannelSelect:変更されたセレクトボックスの値
        categoryId:カテゴリーのid
        channelId:チャンネルのid
        */
        if (!vcSignalData){ // データがない場合は何もしない
            return;
        } else {
            const updateVcChannel:DiscordVcSignal['vcChannels'] = { ...vcSignalData.vcChannels };

            const vcChannel = updateVcChannel[categoryId].map((vc) => (
                vc.id === channelId ? {
                    ...vc,
                    sendChannelId:vcChannelSelect.value
                }
                :vc
            ));

            const setUpdatedData:DiscordVcSignal = {
                ...vcSignalData,
                vcChannels:{categoryId:vcChannel}
            }

            console.log(vcChannel,setUpdatedData);

            //setVcSubmitData(setUpdatedData);
            setVcSignalData(setUpdatedData);
        };
    };

    const vcRoleChannelSelect = (
        vcRoleSelect:MultiValue<SelectOption>,
        categoryId:string,
        channelId:string
    ) => {
        /*
        セレクトのロールが変更されたら、vcChannelsのmentionRoleIdを更新する

        vcRoleSelect:変更されたセレクトボックスの値
        categoryId:カテゴリーのid
        channelId:チャンネルのid
        */
        if (!vcSignalData){
            return;
        } else {
            const updateVcChannel:DiscordVcSignal['vcChannels'] = { ...vcSignalData.vcChannels };
            const roleIds = vcRoleSelect.map(roleId => {
                return roleId.value
            })

            const vcChannel = updateVcChannel[categoryId].map((vc) => (
                vc.id === channelId ? {
                    ...vc,
                    mentionRoleId:[...roleIds]
                }
                :vc
            ));

            const setUpdatedData:DiscordVcSignal = {
                ...vcSignalData,
                vcChannels:{categoryId:vcChannel}
            }

            console.log(vcChannel,setUpdatedData);

            //setVcSubmitData(setUpdatedData);
            setVcSignalData(setUpdatedData);
        };
    };

    const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        /*
        チェックボックスの値が変更されたら、vcChannelsのeveryoneMentionかjoinBotを更新する

        name    :channel id
        value   :category id
        checked :bool
        */
        const { name, value, checked, id } = e.target;

        if (!vcSignalData){
            return;
        } else {
            const updateVcChannel:DiscordVcSignal['vcChannels'] = { ...vcSignalData.vcChannels };

            const vcChannel = updateVcChannel[value].map((vc) => (
                vc.id === name && id.includes("everyoneMention") ? {
                    ...vc,
                    everyoneMention:checked
                }
                : vc.id === name && id.includes("joinBot") ? {
                    ...vc,
                    joinBot:checked
                }
                :vc
            ));

            const setUpdatedData:DiscordVcSignal = {
                ...vcSignalData,
                vcChannels:{[value]:vcChannel}
            }

            //setVcSubmitData(setUpdatedData);
            setVcSignalData(setUpdatedData);
        }
    }

    const SERVER_BASE_URL = process.env.REACT_APP_SERVER_URL
    useEffect(() => {
        let ignore = false;
        async function fetchData() {
            try {
                const response = await axios.get<DiscordVcSignal>(
                    `${SERVER_BASE_URL}/guild/${id}/vc-signal/view`,
                    { withCredentials: true }
                );
                const responseData = response.data;
                console.log(responseData);
                setVcSignalData(responseData);
                //setVcSubmitData(responseData);
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
        if(vcSignalData){
            const vcChannelList = Object.keys(vcSignalData.vcChannels).map((categoryId) => {
                return vcSignalData.vcChannels[categoryId].map((vcChannel) => {
                    return {
                        vc_channel_id:vcChannel.id,
                        send_channel_id:vcChannel.sendChannelId,
                        send_signal:vcChannel.sendSignal,
                        everyone_mention:vcChannel.everyoneMention,
                        join_bot:vcChannel.joinBot,
                        mention_role_id:vcChannel.mentionRoleId
                    }
                })
            })
            const json = {
                guild_id:id,
                vc_channel_list:vcChannelList.flat()
            }
            // json文字列に変換(guild_id)はstrに変換
            const jsonData = JSON.stringify(json,(key, value) => {
                if (typeof value === 'bigint') {
                    return value.toString();
                }
                return value;
            });
            console.log(vcSignalData,JSON.parse(jsonData));
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    } else {
        const discordCategoryChannel = vcSignalData && vcSignalData.categorys !== undefined ? vcSignalData.categorys : [];
        const channelJson = vcSignalData && vcSignalData.channels !== undefined ? vcSignalData.channels : {"123456789012345678": [{ id: "", name: "", type: ""}]}
        const vcChannelJson = vcSignalData && vcSignalData.vcChannels !== undefined ? vcSignalData.vcChannels : {"123456789012345678": [{ id: "", name: "",sendChannelId:"",sendSignal:false,everyoneMention:false,joinBot:false,mentionRoleId:[""]}]};
        const discordThreads = vcSignalData && vcSignalData.threads !== undefined ? vcSignalData.threads : [{ id: "", name: "", type: ""}];
        const roles = vcSignalData && vcSignalData.roles !== undefined ? vcSignalData.roles:[{ id: "", name: "", type: ""}];
        return(
            <>
                <form onSubmit={handleFormSubmit}>
                    <details>
                        <summary>
                            <strong>チャンネル一覧</strong>
                        </summary>
                        <ul>
                            <VcChannelSelection
                                discordCategoryChannel={discordCategoryChannel}
                                vcChannelJson={vcChannelJson}
                                channelJson={channelJson}
                                roles={roles}
                                activeThreads={discordThreads}
                                vcChannelSelect={vcChannelSelect}
                                vcRoleChannelSelect={vcRoleChannelSelect}
                                handleCheckChange={handleCheckChange}
                            ></VcChannelSelection>
                        </ul>
                    </details>
                    <button type="submit">Submit</button>
                </form>
            </>
        )
    }
}

export default VcSignal;