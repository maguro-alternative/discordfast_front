import { v4 as uuidv4 } from 'uuid';
import React, { useState } from "react";
import axios from 'axios';
import * as cookie from '../units/cookie'

const DiscordLogin = () => {
    const uniqueId = uuidv4();

    const [user, setUser] = useState(null);

    const setCookie = cookie.useSetCookie();

    const redirect_uri = `${process.env.REACT_APP_SERVER_URL}/discord-callback/`
    const client_id = process.env.REACT_APP_DISCORD_CLINET_ID

    const discordLoginUri = `https://discord.com/api/oauth2/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=identify&prompt=consent`
    const SERVER_BASE_URL = process.env.REACT_APP_SERVER_URL

    const DiscordLoginRedirect = () => {
        const discordLoginUriState = `${discordLoginUri}&state=${uniqueId}`
        setCookie('state',uniqueId,7)
        axios.get(
            `${SERVER_BASE_URL}/oauth_save_state/${uniqueId}`,
            { withCredentials: true } // CORS設定のためにクッキーを送信、抗することでFastAPI側で保存されたセッションが使用できる
        );
        window.location.href = discordLoginUriState;
    }

    const handleCallback = async () => {

        const response = await axios.get(
            `${SERVER_BASE_URL}`,
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
