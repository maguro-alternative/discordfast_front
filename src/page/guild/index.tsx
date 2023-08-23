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

    return(
        <></>
    )
}

export default GuildID;