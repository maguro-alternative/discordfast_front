import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { MultiValue } from "react-select";
import axios from 'axios';

import {
    DiscordVcSignal,
    SelectOption
} from '../../../store';
import VcChannelSelection from "./VcChannelSelection";

const VcSignal = () => {
    const { id } = useParams(); // パラメータを取得

    const [vcSignalData, setVcSignalData] = useState<DiscordVcSignal>();
    const [isLoading, setIsLoading] = useState(true);   // ロード中かどうか
    const [vcSubmitData, setVcSubmitData] = useState<DiscordVcSignal>();

    const vcChannelSelect = (
        vcChannelSelect:SelectOption,
        categoryId:string,
        channelId:string
    ) => {
        if (!vcSignalData){
            return;
        } else {
            const updateVcChannel:DiscordVcSignal['vcChannels'] = { ...vcSignalData.vcChannels };

            const vcChannel = updateVcChannel[categoryId].map((vc) => (
                vc.id === channelId ? {
                    ...vc,
                    sendChannelId:vcChannelSelect.value
                }
                :vc
            ));

            const setUpdatedData:DiscordVcSignal = {
                ...vcSignalData,
                vcChannels:{categoryId:vcChannel}
            }

            console.log(vcChannel,setUpdatedData);

            setVcSubmitData(setUpdatedData);
        };
    };

    const vcRoleChannelSelect = (
        vcRoleSelect:MultiValue<SelectOption>,
        categoryId:string,
        channelId:string
    ) => {
        if (!vcSignalData){
            return;
        } else {
            const updateVcChannel:DiscordVcSignal['vcChannels'] = { ...vcSignalData.vcChannels };
            const roleIds = vcRoleSelect.map(roleId => {
                return roleId.value
            })

            const vcChannel = updateVcChannel[categoryId].map((vc) => (
                vc.id === channelId ? {
                    ...vc,
                    mentionRoleId:[...roleIds]
                }
                :vc
            ));

            const setUpdatedData:DiscordVcSignal = {
                ...vcSignalData,
                vcChannels:{categoryId:vcChannel}
            }

            console.log(vcChannel,setUpdatedData);

            setVcSubmitData(setUpdatedData);
        };
    };

    const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        /*
        name    :channel id
        value   :category id
        checked :bool
        */
        const { name, value, checked, id } = e.target;

        if (!vcSignalData){
            return;
        } else {
            const updateVcChannel:DiscordVcSignal['vcChannels'] = { ...vcSignalData.vcChannels };

            const vcChannel = updateVcChannel[value].map((vc) => (
                vc.id === name && id.includes("everyoneMention") ? {
                    ...vc,
                    everyoneMention:checked
                }
                : vc.id === name && id.includes("joinBot") ? {
                    ...vc,
                    joinBot:checked
                }
                :vc
            ));

            const setUpdatedData:DiscordVcSignal = {
                ...vcSignalData,
                vcChannels:{[value]:vcChannel}
            }

            setVcSubmitData(setUpdatedData);
        }
    }

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
                                vcChannelSelect={vcChannelSelect}
                                vcRoleChannelSelect={vcRoleChannelSelect}
                                handleCheckChange={handleCheckChange}
                            ></VcChannelSelection>
                        </ul>
                    </details>
                </form>
            </>
        )
    }
}

export default VcSignal;