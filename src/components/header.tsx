import React, { useState, useEffect } from "react";
import axios from 'axios';

interface HeaderProps {
    id: string | undefined;
    username: string | undefined;
    avatar: string | undefined;
    message: string | undefined;
}

const Header = () => {
    const [isLoading, setIsLoading] = useState(true);   // ロード中かどうか
    const [discordHeaderData, setDiscordHeaderData] = useState<HeaderProps>(); // ヘッダー情報
    const [lineHeaderData, setLineHeaderData] = useState<HeaderProps>(); // ヘッダー情報
    const SERVER_BASE_URL = process.env.REACT_APP_SERVER_URL
    const redirect_uri = `${process.env.REACT_APP_SERVER_URL}/discord-callback/`
    const client_id = process.env.REACT_APP_DISCORD_CLINET_ID
    const pathname = window.location.href;

    useEffect(() => {
        let ignore = false;
        async function discordLoginfFetchData() {
            try {
                const response = await axios.get<HeaderProps>(
                    `${SERVER_BASE_URL}/index-discord`,
                    { withCredentials: true }
                );
                const responseData = response.data;

                setDiscordHeaderData(responseData);
                setIsLoading(false); // データ取得完了後にローディングを解除
                console.log(pathname);
            } catch (error: unknown) {
                console.error('ログインに失敗しました。 -', error);
                if(pathname.includes("guild")){
                    window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=identify&prompt=consent`;
                };
                //throw new Error('ログインに失敗しました。 - ', error);
            }
        }
        async function lineLoginFetchData() {
            try {
                const response = await axios.get<HeaderProps>(
                    `${SERVER_BASE_URL}/index-line`,
                    { withCredentials: true }
                );
                const responseData = response.data;

                setLineHeaderData(responseData);
                setIsLoading(false); // データ取得完了後にローディングを解除
                console.log(responseData);
            } catch (error: unknown) {
                console.error('ログインに失敗しました。 -', error);
                if(pathname.includes("group")){
                    window.location.href = `/line-login`;
                };
                //throw new Error('ログインに失敗しました。 - ', error);
            }
        }
        if (!ignore){
            discordLoginfFetchData();
            //lineLoginFetchData();
        }
        return () => {
            ignore = true;
        };
    },[]);
    if(isLoading){
        return (<></>)
    } else {
        return(
            <div style={{background: "#5865f2", color: "#FFF"}}>
                {discordHeaderData && discordHeaderData.message === undefined ? (
                    <div>
                        <p>{discordHeaderData.message}</p>
                        <p>{discordHeaderData.username}</p>
                        <img
                            src={`https://cdn.discordapp.com/avatars/${discordHeaderData.id}/${discordHeaderData.avatar}.webp?size=64`}
                            alt="avatar"
                        />
                    </div>
                ) : (
                    <div>
                        <a href={`${SERVER_BASE_URL}/discord-login`}>Discordでログイン</a>
                    </div>
                )}
                {lineHeaderData && lineHeaderData.message === undefined ? (
                    <div>
                        <p>{lineHeaderData.message}</p>
                        <p>{lineHeaderData.username}</p>
                        <img
                            src={`${lineHeaderData.avatar}`}
                            alt="avatar"
                        />
                    </div>
                ) : (
                    <div>
                        <a href={`${SERVER_BASE_URL}/line-login`}>LINEでログイン</a>
                    </div>
                )}
            </div>
        );
    }
};

export default Header;