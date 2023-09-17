import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { DiscordGuildID } from '../../store';

const GuildID = () => {
    const { id } = useParams(); // パラメータを取得

    const [guildData, setGuildData] = useState<DiscordGuildID>();

    const SERVER_BASE_URL = process.env.REACT_APP_SERVER_URL
    useEffect(() => {
        let ignore = false;
        async function fetchData() {
            try {
                const response = await axios.get<DiscordGuildID>(
                    `${SERVER_BASE_URL}/guild/${id}/view`,
                    { withCredentials: true }
                );
                const responseData = response.data;
                console.log(responseData);
                setGuildData(responseData);
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

    if(!guildData){
        return(
            <></>
        )
    }else{
        return (
            <>
                <a href={`/guild/${id}/`}>
                    <img src={`https://cdn.discordapp.com/icons/${id}/${guildData.guildIcon}.png`} alt="ギルドアイコン" />
                    <h3>{guildData.guildName}</h3>
                </a>
                {guildData.permissionCode | 8 &&
                    <a href={`/guild/${id}/admin`}>管理画面</a>
                }
                <a href={`/guild/${id}/line-post`}>LINE投稿設定</a>
                <a href={`/guild/${id}/line-set`}>LINE設定</a>
                <a href={`/guild/${id}/vc-signal`}>VC通知設定</a>
                <a href={`/guild/${id}/webhook`}>Webhook設定</a>
            </>
        )
    }
}

export default GuildID;