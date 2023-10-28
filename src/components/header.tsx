import React, { useState, useEffect } from "react";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import '../css/header.css'

interface HeaderProps {
    id: string | undefined;
    username: string | undefined;
    avatar: string | undefined;
    message: string | undefined;
    guildId?:string | undefined;
}

const Header = () => {
    const [isLoading, setIsLoading] = useState(true);   // ロード中かどうか
    const [discordHeaderData, setDiscordHeaderData] = useState<HeaderProps>(); // ヘッダー情報
    const [lineHeaderData, setLineHeaderData] = useState<HeaderProps>(); // ヘッダー情報
    const SERVER_BASE_URL = import.meta.env.VITE_SERVER_URL
    const redirect_uri = `${import.meta.env.VITE_SERVER_URL}/discord-callback/`
    const client_id = import.meta.env.VITE_DISCORD_CLINET_ID
    const pathname = window.location.href;

    const DiscordOAuthUrl = `${import.meta.env.VITE_SERVER_URL}/auth/discord`;

    const [isDiscordPopoverVisible, setDiscordPopoverVisible] = useState(false);
    const [isLINEPopoverVisible, setLINEPopoverVisible] = useState(false);

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
                //console.log(pathname);
            } catch (error: unknown) {
                console.error('ログインに失敗しました。 -', error);
                if(pathname.includes("guild")){
                    await discordLoginRedirect();
                };
                setIsLoading(false); // データ取得完了後にローディングを解除
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
                //console.log(responseData);
            } catch (error: unknown) {
                console.error('ログインに失敗しました。 -', error);
                if(pathname.includes("group")){
                    window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/line`;
                };
                //throw new Error('ログインに失敗しました。 - ', error);
                setIsLoading(false); // データ取得完了後にローディングを解除
            }
        }
        if (!ignore){
            discordLoginfFetchData();
            lineLoginFetchData();
        }
        return () => {
            ignore = true;
        };
    },[]);

    const discordLoginRedirect = async() => {
        const uniqueId = uuidv4();
        await axios.get(
            `${SERVER_BASE_URL}/oauth_save_state/${uniqueId}`,
            { withCredentials: true } // CORS設定のためにクッキーを送信、抗することでFastAPI側で保存されたセッションが使用できる
        );
        window.location.href = `${DiscordOAuthUrl}&state=${uniqueId}`;
    };

    if(isLoading){
        return (<></>)
    } else {
        return(
            <div className="header">
                <div className="discord-popver">
                    {discordHeaderData ? (discordHeaderData.message === undefined ? (
                        <div>
                            {isDiscordPopoverVisible ? (
                                <div>
                                    <label
                                        onClick={() => setDiscordPopoverVisible(false)}
                                    >X</label>
                                    <p>{discordHeaderData.username}</p>
                                    <img
                                        src={`https://cdn.discordapp.com/avatars/${discordHeaderData.id}/${discordHeaderData.avatar}.webp?size=64`}
                                        className="avatar"
                                        alt="avatar"
                                        onClick={() => setDiscordPopoverVisible(false)}
                                    />
                                    <a
                                        className="discord-btn"
                                        href={`${SERVER_BASE_URL}/discord-logout`}
                                    >Discord Logout</a>
                                </div>
                            ) : (
                                <img
                                    src={`https://cdn.discordapp.com/avatars/${discordHeaderData.id}/${discordHeaderData.avatar}.webp?size=64`}
                                    className="avatar"
                                    alt="avatar"
                                    onClick={() => setDiscordPopoverVisible(true)}
                                />
                            )}
                        </div>
                    ) : (
                        <div>
                            {isDiscordPopoverVisible ? (
                                <>
                                    <label
                                        onClick={() => setDiscordPopoverVisible(false)}
                                    >X</label>
                                    <a
                                        className="discord-btn"
                                        onClick={() => discordLoginRedirect()}
                                    >Discordでログイン</a>
                                </>
                            ) : (
                                <img
                                    src={`./images/discord-icon.jpg`}
                                    className="avatar"
                                    alt="avatar"
                                    onClick={() => setDiscordPopoverVisible(true)}
                                />
                            )}
                        </div>
                    )):(
                        <div>
                            {isDiscordPopoverVisible ? (
                                <>
                                    <label
                                        onClick={() => setDiscordPopoverVisible(false)}
                                    >X</label>
                                    <a
                                        className="discord-btn"
                                        onClick={() => discordLoginRedirect()}
                                    >Discordでログイン</a>
                                </>
                            ) : (
                                <img
                                    src={`/images/discord-icon.jpg`}
                                    className="avatar"
                                    alt="avatar"
                                    onClick={() => setDiscordPopoverVisible(true)}
                                />
                            )}
                        </div>
                    )}
                </div>
                <div className="line-popver">
                    {lineHeaderData ? (lineHeaderData.message === undefined ? (
                        <div>
                            {isLINEPopoverVisible ? (
                                <div>
                                    <label
                                        onClick={() => setLINEPopoverVisible(false)}
                                    >X</label>
                                    <p>{lineHeaderData.username}</p>
                                    <img
                                        src={`${lineHeaderData.avatar}`}
                                        className="avatar"
                                        alt="avatar"
                                        onClick={() => setLINEPopoverVisible(false)}
                                    />
                                    <a
                                        href={`${SERVER_BASE_URL}/line-logout`}
                                        className="line-btn"
                                    >LINE Logout</a>
                                </div>
                            ) : (
                                <img
                                    src={`${lineHeaderData.avatar}`}
                                    className="avatar"
                                    alt="avatar"
                                    onClick={() => setLINEPopoverVisible(true)}
                                />
                            )}
                        </div>
                    ) : (
                        <div>
                            {isLINEPopoverVisible ? (
                                <>
                                    <label
                                        onClick={() => setLINEPopoverVisible(false)}
                                    >X</label>
                                    <a
                                        href={`${import.meta.env.VITE_SERVER_URL}/auth/line`}
                                        className="line-btn"
                                    >LINEでログイン</a>
                                </>
                            ) : (
                                <img
                                    src={`./images/line-icon.jpg`}
                                    className="avatar"
                                    alt="avatar"
                                    onClick={() => setLINEPopoverVisible(true)}
                                />
                            )}
                        </div>
                    )):(
                        <div>
                            {isLINEPopoverVisible ? (
                                <>
                                    <label
                                        onClick={() => setLINEPopoverVisible(false)}
                                    >X</label>
                                    <a
                                        href={`${import.meta.env.VITE_SERVER_URL}/auth/line`}
                                        className="line-btn"
                                    >LINEでログイン</a>
                                </>
                            ) : (
                                <img
                                    src={`/images/line-icon.png`}
                                    className="avatar"
                                    alt="avatar"
                                    onClick={() => setLINEPopoverVisible(true)}
                                />
                            )}
                        </div>
                    )}
                </div>

                <div className="topbutton">
                    <a
                        className="top-btn"
                        href={`/`}
                    >Topページへ</a>
                </div>
            </div>
        );
    }
};

export default Header;