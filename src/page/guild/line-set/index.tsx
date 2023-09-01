import React, { useState, useEffect } from "react";
import Select,{ MultiValue } from "react-select";
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { DiscordLineSet,LineSetChannels,CategoryChannelType, SelectOption } from '../../../store';
import {
    selectChannelAndThread,
    defalutChannelIdSelected
} from "../../../units/dictComprehension";

const LineSet = () => {
    const { id } = useParams(); // パラメータを取得

    const [lineSetData, setLineSetData] = useState<DiscordLineSet>({
        categorys: [
            {
                "id": "123456789012345678",
                "name": ""
            }
        ],
        channels: {
            "0000": [
                {
                "id": "123456789012345678",
                "name": "eeee",
                "type": "TextChannel"
                }
            ]
        },
        threads: [
            {
                "id": "",
                "name": "seikinfromthefareast"
            }
        ],
        chengePermission: false,
        lineNotifyToken: "",
        lineBotToken: "",
        lineBotSecret: "",
        lineGroupId: "",
        lineClientId: "",
        lineClientSecret: "",
        defalutChannelId: "0",
        debugMode: false
    });
    const [submitData,setSubmitData] = useState({
        guild_id:id,
        line_notify_token:'',
        line_bot_token:'',
        line_bot_secret:'',
        line_group_id:'',
        line_client_id:'',
        line_client_secret:'',
        default_channel_id:'',
        debug_mode:false
    });
    const [isLoading, setIsLoading] = useState(true);   // ロード中かどうか

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value} = e.target;

        if (!lineSetData) {
            return;
        } else {
            setSubmitData((inputDate) => ({
                ...inputDate,
                [name]:value,
            }));
        }
        console.log(submitData)
    };

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
        const selectedDefalutId = defalutChannelIdSelected(
            defalutChannelId,
            threadAndChannels
        )

        return(
            <>
                <form>
                    <h3>新しいLINE Notifyのトークン</h3>
                    <input type="password" name="line_notify_token" onChange={handleInputChange}/>
                    <h6>先頭3文字:{notifyToken}</h6>

                    <h3>新しいLINE Botのトークン</h3>
                    <input type="password" name="line_bot_token" onChange={handleInputChange}/>
                    <h6>先頭3文字:{botToken}</h6>

                    <h3>新しいLINE Botのシークレットキー</h3>
                    <input type="password" name="line_bot_secret" onChange={handleInputChange}/>
                    <h6>先頭3文字:{botSecret}</h6>

                    <h3>新しいLINEグループのid</h3>
                    <input type="password" name="line_group_id" onChange={handleInputChange}/>
                    <h6>先頭3文字:{groupId}</h6>

                    <h3>新しいLINEログインのクライアントid</h3>
                    <input type="password" name="line_client_id" onChange={handleInputChange}/>
                    <h6>先頭3文字:{clinetId}</h6>

                    <h3>新しいLINEログインのクライアントシークレットキー</h3>
                    <input type="password" name="line_client_secret" onChange={handleInputChange}/>
                    <h6>先頭3文字:{clientSecret}</h6>

                    <h3>通知の送信先チャンネル</h3>
                    <Select
                        options={threadAndChannels}
                        defaultValue={selectedDefalutId}
                        onChange={(value) => {
                            if(value){
                                setSubmitData((inputDate) => ({
                                    ...inputDate,
                                    default_channel_id:value.value,
                                }));
                            }
                        }}
                    ></Select>
                </form>
            </>
        )
    }
}

export default LineSet;