import { v4 as uuidv4 } from 'uuid';
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { LineGroup,LineBotLogin } from '../store';

const LineLogin = () => {
    const uniqueId = uuidv4();
    const uniqueId2 = uuidv4();
    const [lineLoginData, setLineLoginData] = useState<LineBotLogin[]>();
    const [isLoading, setIsLoading] = useState(true);   // ロード中かどうか

    useEffect(() => {
        let ignore = false;
        const fetchLineLoginData = async () => {
            const result = await axios.get<LineBotLogin[]>(
                `${process.env.REACT_APP_SERVER_URL}/line-login/view`,
                { withCredentials: true } // CORS設定のためにクッキーを送信、抗することでFastAPI側で保存されたセッションが使用できる
            );
            setLineLoginData(result.data);
            setIsLoading(false);
        };
        if (!ignore){
            fetchLineLoginData();
        }
        return () => {
            ignore = true;
        };
    }, []);

    const LineLoginRedirect = async(
        clientId:string,
        redirectEncodeUri:string,
        guildId:string
    ) => {
        const lineLoginUri = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectEncodeUri}&state=${uniqueId}&scope=profile%20openid%20email&nonce=${uniqueId2}`
        const lineLoginUriState = `${lineLoginUri}&state=${uniqueId}`
        const SERVER_BASE_URL = process.env.REACT_APP_SERVER_URL

        await axios.get(
            `${SERVER_BASE_URL}/oauth_save_state/${uniqueId}`,
            { withCredentials: true } // CORS設定のためにクッキーを送信、抗することでFastAPI側で保存されたセッションが使用できる
        );
        await axios.get(
            `${SERVER_BASE_URL}/oauth_save_nonce/${uniqueId2}`,
            { withCredentials: true } // CORS設定のためにクッキーを送信、抗することでFastAPI側で保存されたセッションが使用できる
        );
        await axios.get(
            `${SERVER_BASE_URL}/oauth_save_guild_id/${guildId}`,
            { withCredentials: true } // CORS設定のためにクッキーを送信、抗することでFastAPI側で保存されたセッションが使用できる
        );
        window.location.href = lineLoginUriState;
    }
    if(lineLoginData){
        console.log(lineLoginData);
        return(
            <>
                {lineLoginData.map((line) => (
                    <a onClick={() => {
                        LineLoginRedirect(
                            line.clientId,
                            line.redirectEncodeUri,
                            line.guildId
                        )
                    }}>
                        <img src={line.pictureUrl}/>
                        <h3>{line.displayName}でログイン</h3>
                    </a>
                ))}
            </>
        );
    }else if(isLoading){
        return(
            <>
                <h3>LINEログイン情報を取得中</h3>
            </>
        );
    }else{
        return(
            <>
                <h3>ログインできるLINEアカウントがありません</h3>
            </>
        );
    }
}

export default LineLogin;