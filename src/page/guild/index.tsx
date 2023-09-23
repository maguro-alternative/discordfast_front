import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../css/guild.css'

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
                    {guildData.guildIcon ? (
                        <img
                            src={`https://cdn.discordapp.com/icons/${id}/${guildData.guildIcon}.png`}
                            alt="ギルドアイコン"
                        />
                    ):(
                        <img
                            src={`../images/discord-icon.jpg`}
                            alt="ギルドアイコン"
                        />
                    )}
                    <h3>{guildData.guildName}</h3>
                </a>
                {guildData.permissionCode | 8 &&
                    <ul>
                        <a
                            href={`/guild/${id}/admin`}
                            className="discord-btn"
                        >管理画面</a>
                    </ul>
                }
                <ul>
                    <a
                        href={`/guild/${id}/line-post`}
                        className="discord-btn"
                    >LINE投稿設定</a>
                    <a
                        href={`/guild/${id}/line-set`}
                        className="discord-btn"
                    >LINE設定</a>
                    <a
                        href={`/guild/${id}/vc-signal`}
                        className="discord-btn"
                    >VC通知設定</a>
                    <a
                        href={`/guild/${id}/webhook`}
                        className="discord-btn"
                    >Webhook設定</a>
                </ul>
            </>
        )
    }
}

export default GuildID;