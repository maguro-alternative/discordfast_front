import React, { useState, useEffect, useMemo } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Select,{ MultiValue } from "react-select";

import { DiscordLinePost,SelectOption,LinePostData } from '../../../store';

import { UserIdComprehension } from "../../../units/dictComprehension";

import BoxCheck from "./CheckBoxForm";

import CategoryChannelSelection from "./CategoryChannelSection";
import NoneCategoryChannelSelection from "./NoneCategoryChannelSelection";
import ThreadCategoryChannelSelection from "./ThreadChannelSelection";

const LinePost = () => {
    const { id } = useParams(); // パラメータを取得

    const [linePostData, setLinePostData] = useState<DiscordLinePost>();
    const [isLoading, setIsLoading] = useState(true);   // ロード中かどうか

    const users = linePostData && linePostData.users !== undefined ? linePostData.users : [];

    const userIdSelect = useMemo(() => {
        return UserIdComprehension(users);    // サーバーメンバー一覧
    }, [users]);

    const messageTypeOption = [
        { value: "MessageType.default", label: "デフォルト" },
        { value: "MessageType.recipient_add", label: "スレッド追加" },
        { value: "MessageType.pins_add", label: "ピン止め" },
    ];

    const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        /*
        チェックボックスの変更を検知して、チェックボックスの値を更新する

        name    :channel id
        value   :category id
        checked :bool
        */
        const { name, value, checked, id } = e.target;
        if (!linePostData) {
            return; // もし linePostData が null または undefined なら何もしない
        } else {
            if (id.includes('Thread')){ // スレッドの項目かどうか
                let updatedChannels:LinePostData['threads'] = [ ...linePostData.threads ]; // threads オブジェクトのコピーを作成

                if (updatedChannels) {
                    const updatedChannelArray = updatedChannels.map(channel => (
                        id.includes('Channel') ?    // LINEに送信するチャンネルの項目かどうか
                            channel.id === name ? {
                                ...channel,
                                lineNgChannel: checked
                            }
                            :channel
                        :   // Botのメッセージを送信するかどうか
                        channel.id === name ? {
                            ...channel,
                            messageBot: checked
                        }
                        :channel
                    ));

                    updatedChannels = updatedChannelArray;  // 更新した配列を代入
                }

                const setUpdatedData: DiscordLinePost = {   // 更新した配列をDiscordLinePostの形式に合うように代入
                    ...linePostData,
                    threads: updatedChannels,
                };

                setLinePostData(setUpdatedData) // 更新したデータを代入
            } else {    // チャンネルの項目の場合
                const updatedChannels:LinePostData['channels'] = { ...linePostData.channels }; // channels オブジェクトのコピーを作成

                if (updatedChannels[value]) {
                    const updatedChannelArray = updatedChannels[value].map(channel => (
                        id.includes('Channel') ?    // LINEに送信するチャンネルの項目かどうか
                            channel.id === name ? {
                                ...channel,
                                lineNgChannel: checked
                            }
                            :channel
                        :   // Botのメッセージを送信するかどうか
                            channel.id === name ? {
                                ...channel,
                                messageBot: checked
                            }
                            :channel
                    ));

                    updatedChannels[value] = updatedChannelArray;
                    //console.log(updatedChannelArray);
                }

                const setUpdatedData: DiscordLinePost = {   // 更新した配列をDiscordLinePostの形式に合うように代入
                    ...linePostData,
                    channels: updatedChannels,
                };

                setLinePostData(setUpdatedData)
            }
        }
    };

    const handleSelectSet = (
        setTypes:string[],
        selectOptions:SelectOption[]
    ) => {
        /*
        ユーザとメッセージタイプのセレクトボックスの初期値を設定する

        setTypes    :設定する値の配列
        selectOptions   :セレクトボックスのオプション
        */
        return setTypes.map(setType => (
            {
                value:setType,
                label:selectOptions[selectOptions.findIndex(type => {
                    return type.value === setType ? type.label:''
                })].label
            }
        ))
    }

    const handleMessageTypeChenge = (
        ngMessageType:MultiValue<SelectOption>,
        categoryId:string,
        channelId:string
    ) => {
        /*
        メッセージタイプのセレクトボックスの変更を検知して、セレクトの値を更新する

        ngMessageType   :セレクトボックスの値
        categoryId      :カテゴリーID
        channelId       :チャンネルID
        */
        if (!linePostData) {
            return; // もし linePostData が null または undefined なら何もしない
        } else {
            if (categoryId.includes('Thread')){ // スレッドの項目かどうか
                let updatedChannels:LinePostData['threads'] = [ ...linePostData.threads ]; // threads オブジェクトのコピーを作成

                const ngMessages = ngMessageType.map((type) => {
                    return type.value
                })

                if (updatedChannels) {
                    const updatedChannelArray = updatedChannels.map(channel => (
                        channel.id === channelId ? {
                            ...channel,
                            ngMessageType: [...ngMessages]
                        }
                        :channel
                    ));

                    updatedChannels = updatedChannelArray;
                }

                const setUpdatedData: DiscordLinePost = {   // 更新した配列をDiscordLinePostの形式に合うように代入
                    ...linePostData,
                    threads: updatedChannels,
                };

                setLinePostData(setUpdatedData);
            }else{  // チャンネルの項目の場合
                const updatedChannels:LinePostData['channels'] = { ...linePostData.channels }; // channels オブジェクトのコピーを作成

                const ngMessages = ngMessageType.map((type) => {
                    return type.value
                })

                if (updatedChannels[categoryId]) {  // もしカテゴリーIDが存在するなら
                    const updatedChannelArray = updatedChannels[categoryId].map(channel => (
                        channel.id === channelId ? {
                            ...channel,
                            ngMessageType: [...ngMessages]
                        }
                        :channel
                    ));

                    updatedChannels[categoryId] = updatedChannelArray;
                }

                const setUpdatedData: DiscordLinePost = {   // 更新した配列をDiscordLinePostの形式に合うように代入
                    ...linePostData,
                    channels: updatedChannels,
                };

                setLinePostData(setUpdatedData);
            }
        }
    }

    const handleUserChenge = (
        ngUser:MultiValue<SelectOption>,
        categoryId:string,
        channelId:string
    ) => {
        /*
        ユーザ項目のセレクトボックスの変更を検知して、セレクトの値を更新する

        ngUser      :セレクトボックスの値
        categoryId  :カテゴリーID
        channelId   :チャンネルID
        */
        if (!linePostData) {
            return; // もし linePostData が null または undefined なら何もしない
        } else {
            const updatedChannels:LinePostData['channels'] = { ...linePostData.channels }; // channels オブジェクトのコピーを作成

            const ngUsers = ngUser.map((type) => {
                return type.value
            })

            if (updatedChannels[categoryId]) {  // もしカテゴリーIDが存在するなら
                const updatedChannelArray = updatedChannels[categoryId].map(channel => (
                    channel.id === channelId ? {
                        ...channel,
                        ngUsers: [...ngUsers]
                    }
                    :channel
                ));

                updatedChannels[categoryId] = updatedChannelArray;
            }

            const setUpdatedData: DiscordLinePost = {   // 更新した配列をDiscordLinePostの形式に合うように代入
                ...linePostData,
                channels: updatedChannels,
            };

            setLinePostData(setUpdatedData)
        }
    }

    const SERVER_BASE_URL = process.env.REACT_APP_SERVER_URL
    useEffect(() => {
        let ignore = false;
        async function fetchData() {
            try {
                const response = await axios.get<DiscordLinePost>(
                    `${SERVER_BASE_URL}/guild/${id}/line-post/view`,
                    { withCredentials: true }
                );
                const responseData = response.data;
                setLinePostData(responseData);
                //console.log(responseData);
                setIsLoading(false); // データ取得完了後にローディングを解除
            } catch (error: unknown) {
                console.error('ログインに失敗しました。 -', error);
                return (<>サーバー側でエラーが出ました。</>);
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
        送信ボタンを押した時の処理
        */
        e.preventDefault();
        if(linePostData){
            const linePostList = Object.keys(linePostData.channels).map((categoryId) => {
                return linePostData.channels[categoryId].map((channel) => {
                    return {
                        channel_id:channel.id,
                        line_ng_channel:channel.lineNgChannel,
                        ng_message_type:channel.ngMessageType,
                        message_bot:channel.messageBot,
                        ng_users:channel.ngUsers
                    }
                })
            })
            const json = {
                guild_id:id,
                channel_list:linePostList.flat()
            }
            // json文字列に変換(guild_id)はstrに変換
            const jsonData = JSON.stringify(json,(key, value) => {
                if (typeof value === 'bigint') {
                    return value.toString();
                }
                return value;
            });
            //console.log(json,JSON.parse(jsonData));
            let check = confirm('送信します。よろしいですか？');
            if (check) {
                // サーバー側に送信
                const linePostJson = await axios.post(
                    `${SERVER_BASE_URL}/api/line-post-success-json`,
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
        const discordCategoryChannel = linePostData && linePostData.categorys !== undefined ? linePostData.categorys : [];
        const discordChannel = linePostData && linePostData.channels !== undefined ? linePostData.channels : {"123456789012345678": [{ id: "", name: "", type: "", lineNgChannel: false, ngMessageType: [""], messageBot: false, ngUsers: [""] }] } ;
        const discordThreads = linePostData && linePostData.threads !== undefined ? linePostData.threads : [{ id: "", name: "", type: "", lineNgChannel: false, ngMessageType: [""], messageBot: false, ngUsers: [""] }];
        const channelJson = discordChannel;
        const chengePermission = linePostData && linePostData.chengePermission !== undefined ? linePostData.chengePermission : false;

        const guildIcon = linePostData && linePostData.guildIcon !== undefined ? linePostData.guildIcon : "";
        const guildName = linePostData && linePostData.guildName !== undefined ? linePostData.guildName : "";
        return(
            <>
                <a href={`/guild/${id}`}>
                    {guildIcon ? (
                        <img
                            src={`https://cdn.discordapp.com/icons/${id}/${guildIcon}.png`}
                            alt="ギルドアイコン"
                        />
                    ):(
                        <img
                            src={`../../images/discord-icon.jpg`}
                            alt="ギルドアイコン"
                        />
                    )}
                    <h3>{guildName}</h3>
                </a>
                <h1>LINE投稿設定</h1>
                <p>LINEに投稿するチャンネルを設定します。</p>
                <form onSubmit={handleFormSubmit}>
                    <details>
                        <summary>
                            <strong>チャンネル一覧</strong>
                        </summary>
                        <ul>
                            <CategoryChannelSelection
                                discordCategoryChannel={discordCategoryChannel}
                                channelJson={channelJson}
                                userIdSelect={userIdSelect}
                                messageTypeOption={messageTypeOption}
                                chengePermission={chengePermission}
                                handleNgCheckChenge={handleCheckChange}
                                handleBotCheckChenge={handleCheckChange}
                                handleMessageTypeChenge={handleMessageTypeChenge}
                                handleUserChenge={handleUserChenge}
                                handleMessageTypeSet={handleSelectSet}
                                handleUserSet={handleSelectSet}
                            ></CategoryChannelSelection>

                            <NoneCategoryChannelSelection
                                channelJson={channelJson}
                                userIdSelect={userIdSelect}
                                messageTypeOption={messageTypeOption}
                                chengePermission={chengePermission}
                                handleNgCheckChenge={handleCheckChange}
                                handleBotCheckChenge={handleCheckChange}
                                handleMessageTypeChenge={handleMessageTypeChenge}
                                handleUserChenge={handleUserChenge}
                                handleMessageTypeSet={handleSelectSet}
                                handleUserSet={handleSelectSet}
                            ></NoneCategoryChannelSelection>

                            <ThreadCategoryChannelSelection
                                discordThreads={discordThreads}
                                userIdSelect={userIdSelect}
                                messageTypeOption={messageTypeOption}
                                chengePermission={chengePermission}
                                handleThreadNgCheckChenge={handleCheckChange}
                                handleThreadBotCheckChenge={handleCheckChange}
                                handleThreadMessageTypeChenge={handleMessageTypeChenge}
                                handleThreadUserChenge={handleUserChenge}
                                handleMessageTypeSet={handleSelectSet}
                                handleUserSet={handleSelectSet}
                            ></ThreadCategoryChannelSelection>
                        </ul>
                    </details>
                    {chengePermission ? (
                        <button type="submit">Submit</button>
                    ):(
                        <></>
                    )}
                </form>
            </>
        )
    }
}

export default LinePost;