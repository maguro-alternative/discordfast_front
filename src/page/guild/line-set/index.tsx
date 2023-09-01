import React, { useState, useEffect } from "react";
import Select,{ MultiValue } from "react-select";
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { DiscordLineSet,LineSetChannels,CategoryChannelType, SelectOption } from '../../../store';

const LineSet = () => {
    const { id } = useParams(); // パラメータを取得

    const [lineSetData, setLineSetData] = useState<DiscordLineSet>();
    const [isLoading, setIsLoading] = useState(true);   // ロード中かどうか

    const SERVER_BASE_URL = process.env.REACT_APP_SERVER_URL
    useEffect(() => {
        let ignore = false;
        async function fetchData() {
            try {
                const response = await axios.get<DiscordLineSet>(
                    `${SERVER_BASE_URL}/guild/${id}/line-set/view`,
                    { withCredentials: true }
                );
                const responseData = response.data;
                console.log(responseData);
                setLineSetData(responseData);
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

    const selectChannelAndThread = (
        categoryChannel:CategoryChannelType[],
        allChannel:LineSetChannels,
        activeThreads:{id:string,name:string}[]
    ) => {
        let selectChannel:SelectOption[] = [];
        let selectChannelTmp:SelectOption[] = [{value:'',label:''}];
        for (let category of categoryChannel) {
            selectChannelTmp = allChannel[category.id].map(channel => (
                {
                    value:channel.id,
                    label:`${category.name}:${channel.name}`
                }
            ))
            Array.prototype.push.apply(selectChannel,selectChannelTmp);
        }
        selectChannelTmp = allChannel["None"].map(channel => (
            {
                value:channel.id,
                label:`カテゴリーなし:${channel.name}`
            }
        ))
        Array.prototype.push.apply(selectChannel,selectChannelTmp);
        selectChannelTmp = activeThreads.map(thread => (
            {
                value:thread.id,
                label:`スレッド:${thread.name}`
            }
        ))
        Array.prototype.push.apply(selectChannel,selectChannelTmp);
        return selectChannel;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    } else {
        const notifyToken = lineSetData && lineSetData.lineNotifyToken !== undefined ? lineSetData.lineNotifyToken : '';
        const botToken = lineSetData && lineSetData.lineBotToken !== undefined ? lineSetData.lineBotToken : '';
        const botSecret = lineSetData && lineSetData.lineBotSecret !== undefined ? lineSetData.lineBotSecret : '';
        const groupId = lineSetData && lineSetData.lineGroupId !== undefined ? lineSetData.lineGroupId : '';
        const clinetId = lineSetData && lineSetData.lineClientId !== undefined ? lineSetData.lineClientId : '';
        const clientSecret = lineSetData && lineSetData.lineClientSecret !== undefined ? lineSetData.lineClientSecret : '';
        const defalutChannelId = lineSetData && lineSetData.defalutChannelId !== undefined ? lineSetData.defalutChannelId : '';

        const categoryChannel = lineSetData && lineSetData.categorys !== undefined ? lineSetData.categorys : [{id:'',name:''}];
        const allChannel = lineSetData && lineSetData.channels !== undefined ? lineSetData.channels : {"0000": [{id: "123456789012345678",name: "eeee",type: "TextChannel"}]};
        const activeThreads = lineSetData && lineSetData.threads !== undefined ? lineSetData.threads : [];

        const threadAndChannels = selectChannelAndThread(
            categoryChannel,
            allChannel,
            activeThreads
        );

        return(
            <>
                <form>
                    <h3>LINE Notifyのトークン</h3>
                    <input type="password" name="line_notify_token"/>
                    <h6>先頭3文字:{notifyToken}</h6>

                    <h3>LINE Botのトークン</h3>
                    <input type="password" name="line_bot_token"/>
                    <h6>先頭3文字:{botToken}</h6>

                    <h3>LINE Botのシークレットキー</h3>
                    <input type="password" name="line_bot_secret"/>
                    <h6>先頭3文字:{botSecret}</h6>

                    <h3>LINEグループのid</h3>
                    <input type="password" name="line_group_id"/>
                    <h6>先頭3文字:{groupId}</h6>

                    <h3>LINEログインのクライアントid</h3>
                    <input type="password" name="line_client_id"/>
                    <h6>先頭3文字:{clinetId}</h6>

                    <h3>LINEログインのクライアントシークレットキー</h3>
                    <input type="password" name="line_client_secret"/>
                    <h6>先頭3文字:{clientSecret}</h6>

                    <h3>通知の送信先チャンネル</h3>
                    <Select
                        options={threadAndChannels}
                    ></Select>
                </form>
            </>
        )
    }
}

export default LineSet;