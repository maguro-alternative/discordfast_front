import React, { useState, useEffect } from "react";
import axios from 'axios';

import { DiscordGuilds } from '../store';

const Guilds = () => {
    const [guildsData, setGuildsData] = useState<DiscordGuilds[]>([]);

    const SERVER_BASE_URL = process.env.REACT_APP_SERVER_URL
    const redirect_uri = `${process.env.REACT_APP_SERVER_URL}/discord-callback/`
    const client_id = process.env.REACT_APP_DISCORD_CLINET_ID

    useEffect(() => {
        let ignore = false;
        async function fetchData() {
            try {
                const response = await axios.get<DiscordGuilds[]>(
                    `${SERVER_BASE_URL}/guilds/view`,
                    { withCredentials: true }
                );
                const responseData = response.data;
                console.log(responseData);
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
