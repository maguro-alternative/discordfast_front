import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Select from "react-select";

import { DiscordLinePost } from '../../../store';

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

const LinePost = () => {
    const { id } = useParams(); // パラメータを取得

    const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
    const [linePostData, setLinePostData] = useState<DiscordLinePost>();
    const [isLoading, setIsLoading] = useState(true);   // ロード中かどうか
    const [isStateing, setIsStateing] = useState(true); // サーバーからデータを取得する前か

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
                                        value="line_ng_channel"
                                        defaultChecked
                                    />
                                    :
                                    <input
                                        type="checkbox"
                                        name={channel.id}
                                        value="line_ng_channel"
                                    />
                                    }
                                    <label>:LINEへ送信しない</label>

                                    {channel.messageBot ?
                                    <input
                                        type="checkbox"
                                        name={channel.id}
                                        value="ng_message_type"
                                        defaultChecked
                                    />
                                    :
                                    <input
                                        type="checkbox"
                                        name={channel.id}
                                        value="ng_message_type"
                                    />
                                    }
                                    <label>:botのメッセージを送信しない</label>

                                    <h5>送信しないメッセージの種類:</h5>
                                    {channel.ngMessageType.includes('MessageType.default') ?
                                    <input
                                        type="checkbox"
                                        name={channel.id}
                                        value="MessageType.default"
                                        defaultChecked
                                    />
                                    :
                                    <input
                                        type="checkbox"
                                        name={channel.id}
                                        value="MessageType.default"
                                    />
                                    }
                                    <label>:デフォルト</label>
                                    {channel.ngMessageType.includes('MessageType.recipient_add') ?
                                    <input
                                        type="checkbox"
                                        name={channel.id}
                                        value="MessageType.recipient_add"
                                        defaultChecked
                                    />
                                    :
                                    <input
                                        type="checkbox"
                                        name={channel.id}
                                        value="MessageType.recipient_add"
                                    />
                                    }
                                    <label>:スレッド追加</label>
                                    {channel.ngMessageType.includes('MessageType.pins_add') ?
                                    <input
                                        type="checkbox"
                                        name={channel.id}
                                        value="MessageType.pins_add"
                                        defaultChecked
                                    />
                                    :
                                    <input
                                        type="checkbox"
                                        name={channel.id}
                                        value="MessageType.pins_add"
                                    />
                                    }
                                    <label>:ピン止め</label>
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