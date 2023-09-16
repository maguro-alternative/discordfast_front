import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface HeaderProps {
    id: string | undefined;
    username: string | undefined;
    avatar: string | undefined;
    message: string | undefined;
}

const Header = () => {
    const [isLoading, setIsLoading] = useState(true);   // ロード中かどうか
    const [headerData, setHeaderData] = useState<HeaderProps>(); // ヘッダー情報
    const [isLoging, isLoginData] = useState();
    const SERVER_BASE_URL = process.env.REACT_APP_SERVER_URL
    const redirect_uri = `${process.env.REACT_APP_SERVER_URL}/discord-callback/`
    const client_id = process.env.REACT_APP_DISCORD_CLINET_ID
    useEffect(() => {
        let ignore = false;
        async function fetchData() {
            try {
                const response = await axios.get<HeaderProps>(
                    `${SERVER_BASE_URL}/index-discord`,
                    { withCredentials: true }
                );
                const responseData = response.data;

                setHeaderData(responseData);
                setIsLoading(false); // データ取得完了後にローディングを解除
                console.log(responseData);
            } catch (error: unknown) {
                console.error('ログインに失敗しました。 -', error);
                window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=identify&prompt=consent`;
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
    if(isLoading){
        return (<></>)
    }else if(headerData){
        return (
            <div style={{background: "#5865f2", color: "#FFF"}}>
                Header
                {headerData.message === undefined ? (
                    <div>
                        <p>{headerData.message}</p>
                        <p>{headerData.username}</p>
                        <img
                            src={`https://cdn.discordapp.com/avatars/${headerData.id}/${headerData.avatar}.webp?size=64`}
                            alt="avatar"
                        />
                    </div>
                ) : (
                    <div>
                        <a href={`${SERVER_BASE_URL}/discord-login`}>Discordでログイン</a>
                    </div>
                )}
            </div>
        );
    }
    return (<></>)
};

export default Header;