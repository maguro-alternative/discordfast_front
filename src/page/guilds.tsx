import React, { useState, useEffect } from "react";
import axios from 'axios';

import Headmeta from "../components/headmeta";
import { DiscordGuilds } from '../store';

const Guilds = () => {
    const [guildsData, setGuildsData] = useState<DiscordGuilds[]>([]);

    const SERVER_BASE_URL = import.meta.env.VITE_SERVER_URL
    const redirect_uri = `${import.meta.env.VITE_SERVER_URL}/discord-callback/`
    const client_id = import.meta.env.VITE_DISCORD_CLINET_ID

    useEffect(() => {
        let ignore = false;
        async function fetchData() {
            try {
                const response = await axios.get<DiscordGuilds[]>(
                    `${SERVER_BASE_URL}/guilds/view`,
                    { withCredentials: true }
                );
                const responseData = response.data;
                //console.log(responseData);
                setGuildsData(responseData);
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
    }, []); // 空の配列を渡すことで初回のみ実行される

    return (
        <>
            <Headmeta
                title="サーバー一覧"
                description="設定変更、閲覧可能なサーバー一覧"
                orginUrl={window.location.href}
                iconUrl="/images/discord-icon.jpg"
            />
            <h1>編集、閲覧可能なサーバ一覧</h1>
            {guildsData.map(guild => (
                <ul key={guild.id}>
                    <a href={`/guild/${guild.id}`}>
                        {guild.icon ? (
                            <img
                                src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                                alt="ギルドアイコン"
                            />
                        ):(
                            <img
                                src={`./images/discord-icon.jpg`}
                                alt="ギルドアイコン"
                            />
                        )
                        }
                        <h3>{guild.name}</h3>
                    </a>
                    <p>Features: {guild.features.join(', ')}</p>
                    {/* 他のギルド情報も表示 */}
                </ul>
            ))}
        </>
    );
}

export default Guilds;
