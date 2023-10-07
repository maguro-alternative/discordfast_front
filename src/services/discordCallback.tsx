import {  useLocation, Navigate } from 'react-router-dom';
import React, { useEffect } from "react";
import * as cookie from '../units/cookie'
import axios from 'axios';

import { DiscordCallbackResponse,DiscordOAuthResponse } from '../store';

const DiscordCallback = () => {
    const setCookie = cookie.useSetCookie();
    const getCookie = cookie.useGetCookie();
    const deleteCookie = cookie.useDeleteCookie();
    const location = useLocation();

    const DISCORD_BASE_URL = "https://discord.com/api"
    const SERVER_BASE_URL = import.meta.env.VITE_SERVER_URL

    let SECRET_KEY = ''
    if (import.meta.env.VITE_SECRET_KEY === undefined){
        SECRET_KEY = ''
    }else{
        SECRET_KEY = import.meta.env.VITE_SECRET_KEY
    }

    useEffect(() => {
        // URLクエリパラメータを取得する
        const queryParams = new URLSearchParams(location.search);
        //console.log(queryParams)

        // cookieからcodeとstateを取得
        const code = queryParams.get("code");
        const state = queryParams.get("state");
        //console.log(code)
        const getstate = getCookie("state");
        deleteCookie("state")
        // stateが一致しない場合、ログイン失敗
        if (state !== getstate){
            //console.log(state,getstate)
            throw new Error('ログインに失敗しました。 - Stateが合いません');
        }

        // OAuth2認証に必要なデータ
        const requestPostdata = {
            client_id       :import.meta.env.VITE_DISCORD_CLINET_ID,
            client_secret   :import.meta.env.VITE_DISCORD_CLIENT_SECRET,
            grant_type:     'authorization_code',
            code            :code,
            redirect_uri    :import.meta.env.VITE_DISCORD_CALLBACK_URL
        }
        // ヘッダー
        const urlEncodedHeaders = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }

        const setDiscordToken = async() => {
            await axios.post<DiscordCallbackResponse>(
                `${DISCORD_BASE_URL}/oauth2/token`,
                requestPostdata,
                {
                    headers:urlEncodedHeaders
                }
            )
            .then(async(response) => {
                const responseData = response.data;
                // レスポンスに含まれるトークンを保存してログイン状態を更新
                /*const encryptedAccessToken = CryptoJS.AES.encrypt(
                    responseData.access_token,
                    SECRET_KEY
                ).toString();*/

                const encryptedAccessToken = await axios.post<DiscordOAuthResponse>(
                    `${SERVER_BASE_URL}/api/oauth2/token`,
                    {
                        token       :responseData.access_token,
                        secret_key  :SECRET_KEY
                    },
                    {
                        headers:urlEncodedHeaders
                    }
                )

                // アクセストークンを保存
                setCookie('DiscordAccessToken',encryptedAccessToken.data.token,7);

                //console.log(responseData.access_token)
                //console.log(encryptedAccessToken)

                //const decryptedText = CryptoJS.AES.decrypt(encryptedAccessToken, SECRET_KEY).toString(CryptoJS.enc.Utf8);
                //console.log(decryptedText)
            })
            .catch(error => {
                console.error('ログインに失敗しました。 -', error);
                throw new Error('ログインに失敗しました。 - ', error);
            });

            // 取得したvalueを使って何か処理を行う（例：APIリクエストを送信する、stateを更新するなど）
            // ここで必要な処理を記述してください
        }

        setDiscordToken();
    }, []);
    return(
        <>
            <Navigate to="/" />
        </>
    )
}

export default DiscordCallback;