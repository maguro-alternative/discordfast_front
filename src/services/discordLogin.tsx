import { v4 as uuidv4 } from 'uuid';
import React, { useState } from "react";
import * as cookie from '../units/cookie'

const DiscordLogin = () => {
    const uniqueId = uuidv4();

    const setCookie = cookie.useSetCookie();

    const redirect_uri = process.env.REACT_APP_DISCORD_CALLBACK_URL
    const client_id = process.env.REACT_APP_DISCORD_CLINET_ID

    const discordLoginUri = `https://discord.com/api/oauth2/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=identify&prompt=consent`

    const DiscordLoginRedirect = () => {
        const discordLoginUriState = `${discordLoginUri}&state=${uniqueId}`
        setCookie('state',uniqueId,7)
        window.location.href = discordLoginUriState;
    }

    return (
        <div>
            <a onClick={DiscordLoginRedirect}>Discordでログイン</a>
        </div>
    );
};

export default DiscordLogin;
