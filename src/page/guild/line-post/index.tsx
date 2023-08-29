import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';

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

interface ChannelsData {
    [channelId: string]: Channel[];
}

const LinePost = () => {
    const { id } = useParams(); // パラメータを取得

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
        const channelJson = JSON.parse(JSON.stringify(discordChannel));
        return(
            <>
                <details>
                    <summary>
                        <strong>チャンネル一覧</strong>
                    </summary>
                    {discordCategoryChannel.map((categoryChannel,index) => (
                        <li key={categoryChannel.id}>
                            <strong>Channel ID:</strong> {categoryChannel.id}
                            <ul>
                            {
                                channelJson[discordCategoryChannel[index].id].map((channel:Channel,i:number) => (
                                    channel.id
                                ))
                            }
                            </ul>
                    </li>
                    ))}
                </details>
            </>
        )
    }
}

export default LinePost;