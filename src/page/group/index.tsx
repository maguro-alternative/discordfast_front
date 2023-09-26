import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import Select,{ MultiValue } from "react-select";
import axios from 'axios';

import { LineGroup, SelectOption } from '../../store';
import { selectChannelAndThread,defalutChannelIdSelected } from "../../units/dictComprehension";

interface ChannelChange{
    defalutChannelId:string;
    chengeAlert:boolean;
};

const LineGroupSetting = () => {
    const { id } = useParams(); // パラメータを取得

    const [lineGroupData, setLineGroupData] = useState<LineGroup>();
    const [lineChangeChannel, setLineChangeChannel] = useState<ChannelChange>();

    const SERVER_BASE_URL = process.env.REACT_APP_SERVER_URL
    useEffect(() => {
        let ignore = false;
        async function fetchData() {
            try {
                const response = await axios.get<LineGroup>(
                    `${SERVER_BASE_URL}/group/${id}/line-group/view`,
                    { withCredentials: true }
                );
                const responseData = response.data;
                //console.log(responseData);
                setLineGroupData(responseData);
                setLineChangeChannel({
                    defalutChannelId:responseData.defalutChannelId,
                    chengeAlert:false
                })
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

    const changeDefalutChannel = (
        selectChannel:SelectOption
    ) => {
        if (lineChangeChannel){
            setLineChangeChannel({
                ...lineChangeChannel,
                defalutChannelId:selectChannel.value
            });
        };
    };

    const changeChackAlert = (
        e:React.ChangeEvent<HTMLInputElement>
    ) => {
        if (lineChangeChannel){
            setLineChangeChannel({
                ...lineChangeChannel,
                chengeAlert:e.target.checked
            });
        };
    }

    const handleFormSubmit = async(e: React.FormEvent) => {
        /*
        送信ボタンを押したときの処理
        */
        e.preventDefault();
        if(lineChangeChannel){
            const json = {
                guild_id:id,
                default_channel_id:lineChangeChannel.defalutChannelId,
                chenge_alert:lineChangeChannel.chengeAlert
            }
            // json文字列に変換(guild_id)はstrに変換
            const jsonData = JSON.stringify(json,(key, value) => {
                if (typeof value === 'bigint') {
                    return value.toString();
                }
                return value;
            });
            let check = window.confirm('送信します。よろしいですか？');
            if (check) {
                // サーバー側に送信
                const lineGroupJson = await axios.post(
                    `${SERVER_BASE_URL}/api/line-group-success-json`,
                    JSON.parse(jsonData),
                    { withCredentials: true }
                )
                // 通信が成功したときに返ってくる
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

    if(!lineGroupData){
        return(
            <></>
        )
    }else{
        const selectChannels = selectChannelAndThread(
            lineGroupData.categorys,
            lineGroupData.channels,
            lineGroupData.threads
        );
        const defalutSelectChannel = defalutChannelIdSelected(
            lineGroupData.defalutChannelId,
            selectChannels
        )
        return(
            <form onSubmit={handleFormSubmit}>
                <h3>LINEからのメッセージの送信先チャンネル</h3>
                <Select
                    className="select-bar"
                    defaultValue={defalutSelectChannel}
                    options={selectChannels}
                    onChange={(value) => {
                        if(value){
                            changeDefalutChannel(value)
                        }
                    }}
                />
                <input
                    type="checkbox"
                    name="chenge_alert"
                    onChange={changeChackAlert}
                />
                変更をLINEとDiscordに通知する<br/>
                <input type="submit" value="送信"/>
            </form>
        )
    }
}

export default LineGroupSetting;