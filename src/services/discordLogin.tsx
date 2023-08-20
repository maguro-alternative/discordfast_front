import { v4 as uuidv4 } from 'uuid';
import React, { useState,useEffect } from "react";
import axios from 'axios';
import * as cookie from '../units/cookie'

const DiscordLogin = () => {
    const uniqueId = uuidv4();

    const [user, setUser] = useState(null);

    const setCookie = cookie.useSetCookie();

    const redirect_uri = process.env.REACT_APP_DISCORD_CALLBACK_URL
    const client_id = process.env.REACT_APP_DISCORD_CLINET_ID

    const discordLoginUri = `https://discord.com/api/oauth2/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=identify&prompt=consent`

    const DiscordLoginRedirect = () => {
        const discordLoginUriState = `${discordLoginUri}&state=${uniqueId}`
        setCookie('state',uniqueId,7)
        window.location.href = discordLoginUriState;
    }

    const handleCallback = async () => {

        const response = await axios.get(
            'http://localhost:5000',
            { withCredentials: true } // CORS設定のためにクッキーを送信、抗することでFastAPI側で保存されたセッションが使用できる
        );

        setUser(response.data);
    };


    return (
        <div>
            <a onClick={DiscordLoginRedirect}>Discordでログイン</a>
            {user ? (
                <div>
                </div>
            ) : (
                <button onClick={handleCallback}>Complete Login</button>
            )}
        </div>
    );
};

export default DiscordLogin;
