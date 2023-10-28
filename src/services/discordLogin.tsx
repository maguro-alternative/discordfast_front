import { v4 as uuidv4 } from 'uuid';
import React, { useState } from "react";
import axios from 'axios';

const DiscordLogin = () => {
    const uniqueId = uuidv4();

    const [user, setUser] = useState(null);

    const discordLoginUri = `${import.meta.env.VITE_SERVER_URL}/auth/discord`
    const SERVER_BASE_URL = import.meta.env.VITE_SERVER_URL

    const DiscordLoginRedirect = async() => {
        const discordLoginUriState = `${discordLoginUri}`
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
