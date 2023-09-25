import React, { useState, useEffect } from "react";
import axios from 'axios';

interface LINELoginProps {
    id: string | undefined;
    username: string | undefined;
    avatar: string | undefined;
    message: string | undefined;
    guildId?:string | undefined;
}

function Index(){
    const [lineLoginData, setLineLoginData] = useState<LINELoginProps>(); // ヘッダー情報
    const SERVER_BASE_URL = process.env.REACT_APP_SERVER_URL

    useEffect(() => {
        let ignore = false;
        async function lineLoginFetchData() {
            try {
                const response = await axios.get<LINELoginProps>(
                    `${SERVER_BASE_URL}/index-line`,
                    { withCredentials: true }
                );
                const responseData = response.data;

                setLineLoginData(responseData);
            } catch (error: unknown) {
                console.error('ログインに失敗しました。 -', error);
                //throw new Error('ログインに失敗しました。 - ', error);
            }
        }
        if (!ignore){
            lineLoginFetchData();
        }
        return () => {
            ignore = true;
        };
    },[]);
    return(
        <>
            <a
                href={`/guilds`}
                className="discord-btn"
            >サーバ一覧へ</a>
            {lineLoginData?.id ? (
                <a
                    href={`/group/${lineLoginData.id}`}
                    className="line-btn"
                >Discordチャンネル送信先変更</a>
            ):(
                <a
                    href={`/line-login`}
                    className="line-btn"
                >LINEログイン</a>
            )}
            <h6>iPhoneのSafariでログインがうまくいかない場合、「設定」から「サイト越えのトラッキングを防ぐ」と「すべてのcookieをブロック」を無効にしてください。</h6>
        </>
    )
}
export default Index;