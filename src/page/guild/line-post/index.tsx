import React, { useState, useEffect, useMemo } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Select,{ MultiValue } from "react-select";

import { DiscordLinePost,SelectOption,Channel } from '../../../store';

import { UserIdComprehension } from "../../../units/dictComprehension";

import BoxCheck from "./CheckBoxForm";

interface LinePostData {
    channels: {
        [key: string]: Channel[]; // インデックスシグネチャを使用
    };
    threads: Channel[];
}

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

            setLinePostData(setUpdatedData)
        }
    }

    const handleUserSet = (ngUser:string[]) => {
        return ngUser.map(user => (
            {
                value:user,
                label:userIdSelect[userIdSelect.findIndex(type => {
                    return type.value === user ? type.label:''
                })].label
            }
        ))
    }

    const handleUserChenge = (
        ngUser:MultiValue<SelectOption>,
        categoryId:string,
        channelId:string
    ) => {
        if (!linePostData) {
            return; // もし linePostData が null または undefined なら何もしない
        } else {
            const updatedChannels:LinePostData['channels'] = { ...linePostData.channels }; // channels オブジェクトのコピーを作成

            const ngUsers = ngUser.map((type) => {
                return type.value
            })

            if (updatedChannels[categoryId]) {
                const updatedChannelArray = updatedChannels[categoryId].map(channel => (
                    channel.id === channelId ? {
                        ...channel,
                        ngUsers: [...ngUsers]
                    }
                    :channel
                ));

                updatedChannels[categoryId] = updatedChannelArray;
            }

            const setUpdatedData: DiscordLinePost = {
                ...linePostData,
                channels: updatedChannels,
            };

            setLinePostData(setUpdatedData)
        }
    }

    const handleThreadNgCheckChage = (e: React.ChangeEvent<HTMLInputElement>) => {
        /*
        name    :channel id
        value   :category id
        checked :bool
        */
        const { name, value, checked } = e.target;
        if (!linePostData) {
            return; // もし linePostData が null または undefined なら何もしない
        } else {
            let updatedChannels:LinePostData['threads'] = [ ...linePostData.threads ]; // channels オブジェクトのコピーを作成

            if (updatedChannels) {
                const updatedChannelArray = updatedChannels.map(channel => (
                    channel.id === name ? {
                        ...channel,
                        lineNgChannel: checked
                    }
                    :channel
                ));

                updatedChannels = updatedChannelArray;
            }

            const setUpdatedData: DiscordLinePost = {
                ...linePostData,
                threads: updatedChannels,
            };

            setLinePostData(setUpdatedData)
        }
    };

    const handleThreadBotCheckChage = (e: React.ChangeEvent<HTMLInputElement>) => {
        /*
        name    :channel id
        value   :category id
        checked :bool
        */
        const { name, value, checked } = e.target;
        if (!linePostData) {
            return; // もし linePostData が null または undefined なら何もしない
        } else {
            let updatedChannels:LinePostData['threads'] = [ ...linePostData.threads ]; // channels オブジェクトのコピーを作成

            if (updatedChannels) {
                const updatedChannelArray = updatedChannels.map(channel => (
                    channel.id === name ? {
                        ...channel,
                        messageBot: checked
                    }
                    :channel
                ));

                updatedChannels = updatedChannelArray;
            }

            const setUpdatedData: DiscordLinePost = {
                ...linePostData,
                threads: updatedChannels,
            };

            setLinePostData(setUpdatedData)
        }
    };

    const handleThreadMessageTypeChenge = (
        ngMessageType:MultiValue<SelectOption>,
        channelId:string
    ) => {
        if (!linePostData) {
            return; // もし linePostData が null または undefined なら何もしない
        } else {
            let updatedChannels:LinePostData['threads'] = [ ...linePostData.threads ]; // channels オブジェクトのコピーを作成

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

            const setUpdatedData: DiscordLinePost = {
                ...linePostData,
                threads: updatedChannels,
            };

            setLinePostData(setUpdatedData)
        }
    }

    const handleThreadUserChenge = (
        ngUser:MultiValue<SelectOption>,
        channelId:string
    ) => {
        if (!linePostData) {
            return; // もし linePostData が null または undefined なら何もしない
        } else {
            let updatedChannels:LinePostData['threads'] = [ ...linePostData.threads ]; // channels オブジェクトのコピーを作成

            const ngUsers = ngUser.map((type) => {
                return type.value
            })

            if (updatedChannels) {
                const updatedChannelArray = updatedChannels.map(channel => (
                    channel.id === channelId ? {
                        ...channel,
                        ngUsers: [...ngUsers]
                    }
                    :channel
                ));

                updatedChannels = updatedChannelArray;
            }

            const setUpdatedData: DiscordLinePost = {
                ...linePostData,
                threads: updatedChannels,
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
        e.preventDefault();
        // json文字列に変換(guild_id)はstrに変換
        const jsonData = JSON.stringify(linePostData,(key, value) => {
            if (typeof value === 'bigint') {
                return value.toString();
            }
            return value;
        });
        console.log(linePostData,JSON.parse(jsonData));
    };

    if (isLoading) {
        return <div>Loading...</div>;
    } else {
        const discordCategoryChannel = linePostData && linePostData.categorys !== undefined ? linePostData.categorys : [];
        const discordChannel = linePostData && linePostData.channels !== undefined ? linePostData.channels : {"123456789012345678": [{ id: "", name: "", type: "", lineNgChannel: false, ngMessageType: [""], messageBot: false, ngUsers: [""] }] } ;
        const discordThreads = linePostData && linePostData.threads !== undefined ? linePostData.threads : [{ id: "", name: "", type: "", lineNgChannel: false, ngMessageType: [""], messageBot: false, ngUsers: [""] }];
        const channelJson = JSON.parse(JSON.stringify(discordChannel));

        return(
            <>
                <form onSubmit={handleFormSubmit}>
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
                                        <BoxCheck
                                            channelBool={channel.lineNgChannel}
                                            channelId={channel.id}
                                            categoryChannelId={categoryChannel.id}
                                            labelText=":LINEへ送信しない"
                                            checkBoxCallback={handleNgCheckChage}
                                        ></BoxCheck>

                                        <BoxCheck
                                            channelBool={channel.messageBot}
                                            channelId={channel.id}
                                            categoryChannelId={categoryChannel.id}
                                            labelText=":botのメッセージを送信しない"
                                            checkBoxCallback={handleBotCheckChage}
                                        ></BoxCheck>

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

                                        <h5>メッセージを送信しないユーザー</h5>
                                        <Select
                                            options={userIdSelect}
                                            defaultValue={handleUserSet(channel.ngUsers)}
                                            onChange={(value) => {
                                                if(value){
                                                    handleUserChenge(
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
                                        <BoxCheck
                                            channelBool={channel.lineNgChannel}
                                            channelId={channel.id}
                                            categoryChannelId="None"
                                            labelText=":LINEへ送信しない"
                                            checkBoxCallback={handleNgCheckChage}
                                        ></BoxCheck>
                                        <BoxCheck
                                            channelBool={channel.messageBot}
                                            channelId={channel.id}
                                            categoryChannelId="None"
                                            labelText=":botのメッセージを送信しない"
                                            checkBoxCallback={handleBotCheckChage}
                                        ></BoxCheck>

                                        <h5>送信しないメッセージの種類:</h5>
                                        <Select
                                            options={messageTypeOption}
                                            defaultValue={handleMessageTypeSet(channel.ngMessageType)}
                                            onChange={(value) => {
                                                if(value){
                                                    handleMessageTypeChenge(
                                                        [...value],
                                                        "None",
                                                        channel.id
                                                    )
                                                }else{
                                                    null
                                                };
                                            }}
                                            isMulti // trueに
                                        ></Select>

                                        <h5>メッセージを送信しないユーザー</h5>
                                        <Select
                                            options={userIdSelect}
                                            defaultValue={handleUserSet(channel.ngUsers)}
                                            onChange={(value) => {
                                                if(value){
                                                    handleUserChenge(
                                                        [...value],
                                                        "None",
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
                                        <BoxCheck
                                            channelBool={thread.lineNgChannel}
                                            channelId={thread.id}
                                            categoryChannelId=""
                                            labelText=":LINEへ送信しない"
                                            checkBoxCallback={handleThreadNgCheckChage}
                                        ></BoxCheck>
                                        <BoxCheck
                                            channelBool={thread.messageBot}
                                            channelId={thread.id}
                                            categoryChannelId=""
                                            labelText=":botのメッセージを送信しない"
                                            checkBoxCallback={handleThreadBotCheckChage}
                                        ></BoxCheck>

                                        <h5>送信しないメッセージの種類:</h5>
                                        <Select
                                            options={messageTypeOption}
                                            defaultValue={handleMessageTypeSet(thread.ngMessageType)}
                                            onChange={(value) => {
                                                if(value){
                                                    handleThreadMessageTypeChenge(
                                                        [...value],
                                                        thread.id
                                                    )
                                                }else{
                                                    null
                                                };
                                            }}
                                            isMulti // trueに
                                        ></Select>

                                        <h5>メッセージを送信しないユーザー</h5>
                                        <Select
                                            options={userIdSelect}
                                            defaultValue={handleUserSet(thread.ngUsers)}
                                            onChange={(value) => {
                                                if(value){
                                                    handleThreadUserChenge(
                                                        [...value],
                                                        thread.id
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
                        </ul>
                    </details>
                    <button type="submit">Submit</button>
                </form>
            </>
        )
    }
}

export default LinePost;