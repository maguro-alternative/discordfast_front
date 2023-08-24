import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { DiscordWebhook } from '../../../store';

const Webhook = () => {
    const { id } = useParams(); // パラメータを取得

    const [webhookData, setWebhookData] = useState<DiscordWebhook>();

    const SERVER_BASE_URL = process.env.REACT_APP_SERVER_URL
    useEffect(() => {
        let ignore = false;
        async function fetchData() {
            try {
                const response = await axios.get<DiscordWebhook>(
                    `${SERVER_BASE_URL}/guild/${id}/webhook/view`,
                    { withCredentials: true }
                );
                const responseData = response.data;
                console.log(responseData);
                setWebhookData(responseData);
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

export default Webhook;