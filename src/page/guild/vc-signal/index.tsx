import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';

import {
    DiscordVcSignal,
    VcSignalChannels
} from '../../../store';
import VcChannelSelection from "./VcChannelSelection";

const VcSignal = () => {
    const { id } = useParams(); // パラメータを取得

    const [vcSignalData, setVcSignalData] = useState<DiscordVcSignal>();
    const [isLoading, setIsLoading] = useState(true);   // ロード中かどうか

    const SERVER_BASE_URL = process.env.REACT_APP_SERVER_URL
    useEffect(() => {
        let ignore = false;
        async function fetchData() {
            try {
                const response = await axios.get<DiscordVcSignal>(
                    `${SERVER_BASE_URL}/guild/${id}/vc-signal/view`,
                    { withCredentials: true }
                );
                const responseData = response.data;
                console.log(responseData);
                setVcSignalData(responseData);
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
        const discordCategoryChannel = vcSignalData && vcSignalData.categorys !== undefined ? vcSignalData.categorys : [];
        const channelJson = vcSignalData && vcSignalData.channels !== undefined ? vcSignalData.channels : {"123456789012345678": [{ id: "", name: "", type: ""}]}
        const vcChannelJson = vcSignalData && vcSignalData.vcChannels !== undefined ? vcSignalData.vcChannels : {"123456789012345678": [{ id: "", name: "",sendChannelId:"",sendSignal:false,everyoneMention:false,joinBot:false,mentionRoleId:[""]}]};
        const discordThreads = vcSignalData && vcSignalData.threads !== undefined ? vcSignalData.threads : [{ id: "", name: "", type: ""}];
        const roles = vcSignalData && vcSignalData.roles !== undefined ? vcSignalData.roles:[{ id: "", name: "", type: ""}];
        return(
            <>
                <form>
                    <details>
                        <summary>
                            <strong>チャンネル一覧</strong>
                        </summary>
                        <ul>
                            <VcChannelSelection
                                discordCategoryChannel={discordCategoryChannel}
                                vcChannelJson={vcChannelJson}
                                channelJson={channelJson}
                                roles={roles}
                                activeThreads={discordThreads}
                            ></VcChannelSelection>
                        </ul>
                    </details>
                </form>
            </>
        )
    }
}

export default VcSignal;