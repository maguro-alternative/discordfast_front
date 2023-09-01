import React, { useState, useEffect, useMemo } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Select,{ MultiValue } from "react-select";

import { DiscordLinePost,SelectOption,LinePostChannel } from '../../../store';

import { UserIdComprehension } from "../../../units/dictComprehension";

import BoxCheck from "./CheckBoxForm";

import CategoryChannelSelection from "./CategoryChannelSection";
import NoneCategoryChannelSelection from "./NoneCategoryChannelSelection";
import ThreadCategoryChannelSelection from "./ThreadChannelSelection";

interface LinePostData {
    channels: {
        [key: string]: LinePostChannel[]; // インデックスシグネチャを使用
    };
    threads: LinePostChannel[];
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

    const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        /*
        name    :channel id
        value   :category id
        checked :bool
        */
        const { name, value, checked, id } = e.target;
        if (!linePostData) {
            return; // もし linePostData が null または undefined なら何もしない
        } else {
            if (id.includes('Thread')){
                let updatedChannels:LinePostData['threads'] = [ ...linePostData.threads ]; // channels オブジェクトのコピーを作成

                if (updatedChannels) {
                    const updatedChannelArray = updatedChannels.map(channel => (
                        id.includes('Channel') ?
                            channel.id === name ? {
                                ...channel,
                                lineNgChannel: checked
                            }
                            :channel
                        :
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
            } else {
                const updatedChannels:LinePostData['channels'] = { ...linePostData.channels }; // channels オブジェクトのコピーを作成

                if (updatedChannels[value]) {
                    const updatedChannelArray = updatedChannels[value].map(channel => (
                        id.includes('Channel') ?
                            channel.id === name ? {
                                ...channel,
                                lineNgChannel: checked
                            }
                            :channel
                        :
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
        }
    };

    const handleSelectSet = (
        setTypes:string[],
        selectOptions:SelectOption[]
    ) => {
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
        if (!linePostData) {
            return; // もし linePostData が null または undefined なら何もしない
        } else {
            if (categoryId.includes('Thread')){
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

                setLinePostData(setUpdatedData);
            }else{
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

                setLinePostData(setUpdatedData);
            }
        }
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
        const channelJson = discordChannel;

        return(
            <>
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
                                handleThreadNgCheckChenge={handleCheckChange}
                                handleThreadBotCheckChenge={handleCheckChange}
                                handleThreadMessageTypeChenge={handleMessageTypeChenge}
                                handleThreadUserChenge={handleUserChenge}
                                handleMessageTypeSet={handleSelectSet}
                                handleUserSet={handleSelectSet}
                            ></ThreadCategoryChannelSelection>
                        </ul>
                    </details>
                    <button type="submit">Submit</button>
                </form>
            </>
        )
    }
}

export default LinePost;