import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../css/guild.css'

import Headmeta from "../../components/headmeta";
import { DiscordGuildID } from '../../store';

const GuildID = () => {
    const { id } = useParams(); // パラメータを取得

    const [guildData, setGuildData] = useState<DiscordGuildID>();

    const SERVER_BASE_URL = import.meta.env.VITE_SERVER_URL
    useEffect(() => {
        let ignore = false;
        async function fetchData() {
            try {
                const response = await axios.get<DiscordGuildID>(
                    `${SERVER_BASE_URL}/guild/${id}/view`,
                    { withCredentials: true }
                );
                const responseData = response.data;
                //console.log(responseData);
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
                <Headmeta
                    title={`${guildData.guildName}の設定項目一覧`}
                    description="設定項目一覧"
                    orginUrl={window.location.href}
                    iconUrl={guildData.guildIcon ? (
                        `https://cdn.discordapp.com/icons/${id}/${guildData.guildIcon}.png`
                    ):(
                        `../images/discord-icon.jpg`
                    )}
                />
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
                {guildData.permissionCode & 8 ? (
                    <ul className="flex-ul">
                        <a
                            href={`/guild/${id}/admin`}
                            className="discord-btn"
                        >管理画面</a>
                    </ul>
                ):(
                    <></>
                )
                }
                <ul className="flex-ul">
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

                <ul className="flex-ul">
                    <a
                        href={`/guilds`}
                        className="discord-btn"
                    >前のページに戻る</a>
                </ul>
            </>
        )
    }
}

export default GuildID;