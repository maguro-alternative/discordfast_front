import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Select,{ MultiValue } from "react-select";

import { DiscordLinePost,SelectOption } from '../../../store';

// JSONデータの型定義
interface Channel {
    id: string;
    name: string;
    type: string;
    lineNgChannel: boolean;
    ngMessageType: string[];
    messageBot: boolean;
    ngUsers: string[];
}

interface LinePostData {
    channels: {
        [key: string]: Channel[]; // インデックスシグネチャを使用
    };
}

const LinePost = () => {
    const { id } = useParams(); // パラメータを取得

    const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
    const [selectedNgMessageType,setSelectedNgMessageType] = useState<SelectOption[]>();
    const [linePostData, setLinePostData] = useState<DiscordLinePost>();
    const [isLoading, setIsLoading] = useState(true);   // ロード中かどうか
    const [isStateing, setIsStateing] = useState(true); // サーバーからデータを取得する前か

    const messageTypeOption = [
        { value: "MessageType.default", label: "デフォルト" },
        { value: "MessageType.recipient_add", label: "スレッド追加" },
        { value: "MessageType.pins_add", label: "ピン止め" },
    ];

    const handleNgCheckChage = (e: React.ChangeEvent<HTMLInputElement>) => {
        /*
        name    :channel id
        value   :category id
        checked :bool
        */
        const { name, value, checked } = e.target;
        if (!linePostData) {
            return; // もし linePostData が null または undefined なら何もしない
        } else {
            const updatedChannels:LinePostData['channels'] = { ...linePostData.channels }; // channels オブジェクトのコピーを作成

            if (updatedChannels[value]) {
                const updatedChannelArray = updatedChannels[value].map(channel => (
                    channel.id === name ? {
                        ...channel,
                        lineNgChannel: checked
                    }
                    :channel
                ));

                updatedChannels[value] = updatedChannelArray;
            }

            const setUpdatedData: DiscordLinePost = {
                ...linePostData,
                channels: updatedChannels,
            };

            console.log(setUpdatedData);
            setLinePostData(setUpdatedData)
        }
    };

    const handleBotCheckChage = (e: React.ChangeEvent<HTMLInputElement>) => {
        /*
        name    :channel id
        value   :category id
        checked :bool
        */
        const { name, value, checked } = e.target;
        if (!linePostData) {
            return; // もし linePostData が null または undefined なら何もしない
        } else {
            const updatedChannels:LinePostData['channels'] = { ...linePostData.channels }; // channels オブジェクトのコピーを作成

            if (updatedChannels[value]) {
                const updatedChannelArray = updatedChannels[value].map(channel => (
                    channel.id === name ? {
                        ...channel,
                        messageBot: checked
                    }
                    :channel
                ));

                updatedChannels[value] = updatedChannelArray;
            }

            const setUpdatedData: DiscordLinePost = {
                ...linePostData,
                channels: updatedChannels,
            };

            console.log(setUpdatedData);
            setLinePostData(setUpdatedData)
        }
    };

    const handleMessageTypeSet = (ngMessageType:string[]) => {
        return ngMessageType.map(messageType => (
            {
                value:messageType,
                label:messageTypeOption[messageTypeOption.findIndex(type => {
                    return type.value === messageType ? type.label:''
                })].label
            }
        ))
    }

    const handleMessageTypeChenge = (
        ngMessageType:MultiValue<SelectOption>,
        categoryId:string,
        channelId:string
    ) => {
        if (!linePostData) {
            return; // もし linePostData が null または undefined なら何もしない
        } else {
            const updatedChannels:LinePostData['channels'] = { ...linePostData.channels }; // channels オブジェクトのコピーを作成

            const ngMessages = ngMessageType.map((type) => {
                return type.value
            })

            if (updatedChannels[categoryId]) {
                const updatedChannelArray = updatedChannels[categoryId].map(channel => (
                    channel.id === channelId ? {
                        ...channel,
                        ngMessageType: [...ngMessages]
                    }
                    :channel
                ));

                updatedChannels[categoryId] = updatedChannelArray;
            }

            const setUpdatedData: DiscordLinePost = {
                ...linePostData,
                channels: updatedChannels,
            };

            console.log(setUpdatedData);
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
                console.log(responseData);
                setLinePostData(responseData);
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

    if (isLoading) {
        return <div>Loading...</div>;
    } else {
        const discordCategoryChannel = linePostData && linePostData.categorys !== undefined ? linePostData.categorys : [];
        const discordChannel = linePostData && linePostData.channels !== undefined ? linePostData.channels : {"123456789012345678": [{ id: "", name: "", type: "", lineNgChannel: false, ngMessageType: [""], messageBot: false, ngUsers: [""] }] } ;
        const discordThreads = linePostData && linePostData.threads !== undefined ? linePostData.threads : [{ id: "", name: "", type: "", lineNgChannel: false, ngMessageType: [""], messageBot: false, ngUsers: [""] }];
        const channelJson = JSON.parse(JSON.stringify(discordChannel));

        return(
            <>
                <details>
                    <summary>
                        <strong>チャンネル一覧</strong>
                    </summary>
                    <ul>
                    {discordCategoryChannel.map((categoryChannel,index) => (
                        <details key={categoryChannel.id}>
                            <summary>
                                <strong>{categoryChannel.name}</strong>
                            </summary>
                            <ul>
                            {channelJson[discordCategoryChannel[index].id].map((channel:Channel,i:number) => (
                                <details key={channel.id}>
                                    <summary>
                                        <strong>
                                            {channel.type === 'VoiceChannel' && `🔊:`}
                                            {channel.type === 'TextChannel' && `#:`}
                                            {channel.name}
                                        </strong>
                                    </summary>
                                    {channel.lineNgChannel ?
                                    <input
                                        type="checkbox"
                                        name={channel.id}
                                        value={categoryChannel.id}
                                        defaultChecked
                                        onChange={handleNgCheckChage}
                                    />
                                    :
                                    <input
                                        type="checkbox"
                                        name={channel.id}
                                        value={categoryChannel.id}
                                        onChange={handleNgCheckChage}
                                    />
                                    }
                                    <label>:LINEへ送信しない</label>

                                    {channel.messageBot ?
                                    <input
                                        type="checkbox"
                                        name={channel.id}
                                        value="ng_message_type"
                                        defaultChecked
                                        onChange={handleBotCheckChage}
                                    />
                                    :
                                    <input
                                        type="checkbox"
                                        name={channel.id}
                                        value="ng_message_type"
                                        onChange={handleBotCheckChage}
                                    />
                                    }
                                    <label>:botのメッセージを送信しない</label>

                                    <h5>送信しないメッセージの種類:</h5>
                                    <Select
                                        options={messageTypeOption}
                                        defaultValue={handleMessageTypeSet(channel.ngMessageType)}
                                        onChange={(value) => {
                                            if(value){
                                                handleMessageTypeChenge(
                                                    [...value],
                                                    categoryChannel.id,
                                                    channel.id
                                                )
                                            }else{
                                                null
                                            };
                                        }}
                                        isMulti // trueに
                                    ></Select>
                                </details>
                            ))}
                            </ul>
                        </details>
                    ))}
                    {channelJson["None"].length > 0 ? (
                        <details>
                            <summary>
                                <strong>カテゴリーなし</strong>
                            </summary>
                            <ul>
                            {channelJson["None"].map((channel:Channel,i:number) => (
                                <details key={channel.id}>
                                    <summary>
                                        <strong>
                                            {channel.type === 'VoiceChannel' && `🔊:`}
                                            {channel.type === 'TextChannel' && `#:`}
                                            {channel.name}
                                        </strong>
                                    </summary>
                                    {channel.id}
                                </details>
                            ))}
                            </ul>
                        </details>
                    ):(<></>)}
                    <details>
                        <summary>
                            <strong>スレッド一覧</strong>
                        </summary>
                        <ul>
                        {discordThreads.map((thread,index) => (
                            <details key={thread.id}>
                                <summary>
                                    <strong>{thread.name}</strong>
                                </summary>
                            </details>
                        ))}
                        </ul>
                        </details>
                    </ul>
                </details>
            </>
        )
    }
}

export default LinePost;