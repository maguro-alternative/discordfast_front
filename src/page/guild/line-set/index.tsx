import React, { useState, useEffect } from "react";
import Select,{ MultiValue } from "react-select";
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { DiscordLineSet,DiscordLineSetSubmitData } from '../../../store';
import Headmeta from "../../../components/headmeta";
import {
    selectChannelAndThread,
    defalutChannelIdSelected
} from "../../../units/dictComprehension";

const LineSet = () => {
    const { id } = useParams(); // パラメータを取得

    const [lineSetData, setLineSetData] = useState<DiscordLineSet>();
    const [submitData,setSubmitData] = useState<DiscordLineSetSubmitData>({
        guild_id:id,
        default_channel_id:'',
        debug_mode:false
    });
    const [isLoading, setIsLoading] = useState(true);   // ロード中かどうか

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        /*
        textの入力を受け取る
        */
        const { name, value} = e.target;

        if (!lineSetData) {
            return;
        } else {
            setSubmitData((inputDate) => ({
                ...inputDate,
                [name]:value,
            }));
        }
        //console.log(submitData)
    };

    const handleFormSubmit = async(e: React.FormEvent) => {
        /*
        送信ボタンを押したときの処理
        */
        e.preventDefault();
        // json文字列に変換(guild_id)はstrに変換
        const jsonData = JSON.stringify(submitData,(key, value) => {
            if (typeof value === 'bigint') {
                return value.toString();
            }
            return value;
        });
        //console.log(submitData,JSON.parse(jsonData));
        let check = window.confirm('送信します。よろしいですか？');
        if (check) {
            // サーバー側に送信
            const lineSetJson = await axios.post(
                `${SERVER_BASE_URL}/api/line-set-success-json`,
                JSON.parse(jsonData),
                { withCredentials: true }
            )// 通信が成功したときに返ってくる
            .then(function () {
                alert('送信完了!');
                window.location.href = `/guild/${id}`;
            })
            // 通信が失敗したときに返ってくる
            .catch(function (error) {
                alert(error);
            });
        }
    };

    const SERVER_BASE_URL = process.env.REACT_APP_SERVER_URL
    useEffect(() => {
        let ignore = false;
        async function fetchData() {
            try {
                const response = await axios.get<DiscordLineSet>(
                    `${SERVER_BASE_URL}/guild/${id}/line-set/view`,
                    { withCredentials: true }
                );
                const responseData = response.data;
                //console.log(responseData);
                setLineSetData(responseData);
                // 送信先チャンネルを設定
                setSubmitData((inputDate) => ({
                    ...inputDate,
                    default_channel_id:responseData.defalutChannelId
                }))
                setIsLoading(false); // データ取得完了後にローディングを解除
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

    if (isLoading) {
        return <div>Loading...</div>;
    } else {
        const notifyToken = lineSetData && lineSetData.lineNotifyToken !== undefined ? lineSetData.lineNotifyToken : '';
        const botToken = lineSetData && lineSetData.lineBotToken !== undefined ? lineSetData.lineBotToken : '';
        const botSecret = lineSetData && lineSetData.lineBotSecret !== undefined ? lineSetData.lineBotSecret : '';
        const groupId = lineSetData && lineSetData.lineGroupId !== undefined ? lineSetData.lineGroupId : '';
        const clinetId = lineSetData && lineSetData.lineClientId !== undefined ? lineSetData.lineClientId : '';
        const clientSecret = lineSetData && lineSetData.lineClientSecret !== undefined ? lineSetData.lineClientSecret : '';
        const defalutChannelId = lineSetData && lineSetData.defalutChannelId !== undefined ? lineSetData.defalutChannelId : '';

        const categoryChannel = lineSetData && lineSetData.categorys !== undefined ? lineSetData.categorys : [{id:'',name:''}];
        const allChannel = lineSetData && lineSetData.channels !== undefined ? lineSetData.channels : {"0000": [{id: "123456789012345678",name: "eeee",type: "TextChannel"}]};
        const activeThreads = lineSetData && lineSetData.threads !== undefined ? lineSetData.threads : [];

        const chengePermission = lineSetData && lineSetData.chengePermission !== undefined ? lineSetData.chengePermission : false;

        const guildIcon = lineSetData && lineSetData.guildIcon !== undefined ? lineSetData.guildIcon : '';
        const guildName = lineSetData && lineSetData.guildName !== undefined ? lineSetData.guildName : '';

        const threadAndChannels = selectChannelAndThread(   // チャンネルとスレッドを結合
            categoryChannel,
            allChannel,
            activeThreads
        );
        const selectedDefalutId = defalutChannelIdSelected( // デフォルトチャンネルを選択
            defalutChannelId,
            threadAndChannels
        )

        return(
            <>
                <Headmeta
                    title={`${guildName}のLINEBot設定`}
                    description="LINEBotの設定です"
                    orginUrl={window.location.href}
                    iconUrl={guildIcon ? (
                        `https://cdn.discordapp.com/icons/${id}/${guildIcon}.png`
                    ):(
                        `../../images/discord-icon.jpg`
                    )}
                />
                <a href={`/guild/${id}`}>
                    {guildIcon ? (
                        <img
                            src={`https://cdn.discordapp.com/icons/${id}/${guildIcon}.png`}
                            alt="ギルドアイコン"
                        />
                    ):(
                        <img
                            src={`../../images/discord-icon.jpg`}
                            alt="ギルドアイコン"
                        />
                    )}
                    <h3>{guildName}</h3>
                </a>
                <h2>LINEBot設定</h2>
                <h6>※LINE NotifyのトークンとLINE Botのトークン、シークレットキーは必須です。</h6>
                <form onSubmit={handleFormSubmit}>
                    <h3>新しいLINE Notifyのトークン</h3>
                    <input
                        type="password"
                        name="line_notify_token"
                        onChange={handleInputChange}
                        {...chengePermission ? {} : {disabled:true}}
                    />
                    <br/>
                    <label>LINE Notifyのトークンを消去する</label>
                    <input
                        type="checkbox"
                        name="line_notify_token_check"
                        onChange={(value => {
                            if(value){
                                setSubmitData((inputDate) => ({
                                    ...inputDate,
                                    line_notify_token_del_flag:value.target.checked,
                                }));
                            }
                        })}
                        {...chengePermission ? {} : {disabled:true}}
                    />
                    <h6>先頭3文字:{notifyToken}</h6>

                    <h3>新しいLINE Botのトークン</h3>
                    <input
                        type="password"
                        name="line_bot_token"
                        onChange={handleInputChange}
                        {...chengePermission ? {} : {disabled:true}}
                    />
                    <br/>
                    <label>LINE Botのトークンを消去する</label>
                    <input
                        type="checkbox"
                        name="line_bot_token_check"
                        onChange={(value => {
                            if(value){
                                setSubmitData((inputDate) => ({
                                    ...inputDate,
                                    line_bot_token_del_flag:value.target.checked,
                                }));
                            }
                        })}
                        {...chengePermission ? {} : {disabled:true}}
                    />
                    <h6>先頭3文字:{botToken}</h6>

                    <h3>新しいLINE Botのシークレットキー</h3>
                    <input
                        type="password"
                        name="line_bot_secret"
                        onChange={handleInputChange}
                        {...chengePermission ? {} : {disabled:true}}
                    />
                    <br/>
                    <label>LINE Botのシークレットキーを消去する</label>
                    <input
                        type="checkbox"
                        name="line_bot_secret_check"
                        onChange={(value => {
                            if(value){
                                setSubmitData((inputDate) => ({
                                    ...inputDate,
                                    line_bot_secret_del_flag:value.target.checked,
                                }));
                            }
                        })}
                        {...chengePermission ? {} : {disabled:true}}
                    />
                    <h6>先頭3文字:{botSecret}</h6>

                    <h3>新しいLINEグループのid</h3>
                    <input
                        type="password"
                        name="line_group_id"
                        onChange={handleInputChange}
                        {...chengePermission ? {} : {disabled:true}}
                    />
                    <br/>
                    <label>LINEグループのidを消去する</label>
                    <input
                        type="checkbox"
                        name="line_group_id_check"
                        onChange={(value => {
                            if(value){
                                setSubmitData((inputDate) => ({
                                    ...inputDate,
                                    line_group_id_del_flag:value.target.checked,
                                }));
                            }
                        })}
                        {...chengePermission ? {} : {disabled:true}}
                    />
                    <h6>先頭3文字:{groupId}</h6>

                    <h3>新しいLINEログインのクライアントid</h3>
                    <input
                        type="password"
                        name="line_client_id"
                        onChange={handleInputChange}
                        {...chengePermission ? {} : {disabled:true}}
                    />
                    <br/>
                    <label>LINEログインのクライアントidを消去する</label>
                    <input
                        type="checkbox"
                        name="line_client_id_check"
                        onChange={(value => {
                            if(value){
                                setSubmitData((inputDate) => ({
                                    ...inputDate,
                                    line_client_id_del_flag:value.target.checked,
                                }));
                            }
                        })}
                        {...chengePermission ? {} : {disabled:true}}
                    />
                    <h6>先頭3文字:{clinetId}</h6>

                    <h3>新しいLINEログインのクライアントシークレットキー</h3>
                    <input
                        type="password"
                        name="line_client_secret"
                        onChange={handleInputChange}
                        {...chengePermission ? {} : {disabled:true}}
                    />
                    <br/>
                    <label>LINEログインのクライアントシークレットキーを消去する</label>
                    <input
                        type="checkbox"
                        name="line_client_secret_check"
                        onChange={(value => {
                            if(value){
                                setSubmitData((inputDate) => ({
                                    ...inputDate,
                                    line_client_secret_del_flag:value.target.checked,
                                }));
                            }
                        })}
                        {...chengePermission ? {} : {disabled:true}}
                    />
                    <h6>先頭3文字:{clientSecret}</h6>

                    <h3>通知の送信先チャンネル</h3>
                    <Select
                        className="select-bar"
                        options={threadAndChannels}
                        defaultValue={selectedDefalutId}
                        onChange={(value) => {
                            if(value){
                                setSubmitData((inputDate) => ({
                                    ...inputDate,
                                    default_channel_id:value.value,
                                }));
                            }
                        }}
                        {...chengePermission ? {} : {isDisabled:true}}
                    ></Select>

                    <h3>デバッグモード</h3>
                    <h6>有効にすると、LINEグループにグループIDを送信します。(トークンとシークレットキーは必須)</h6>
                    <label>デバッグモードを有効にする</label>
                    <input type="checkbox" name="debug_mode" onChange={(value => {
                        if(value){
                            setSubmitData((inputDate) => ({
                                ...inputDate,
                                debug_mode:value.target.checked,
                            }));
                        }
                    })}
                    {...chengePermission ? {} : {disabled:true}}
                    />
                    <a
                        href={`/guild/${id}`}
                        className="blue-btn"
                    >前のページに戻る</a>
                    <br/>
                    {chengePermission ? (
                        <button type="submit">Submit</button>
                    ):(
                        <></>
                    )}
                </form>
            </>
        )
    }
}

export default LineSet;