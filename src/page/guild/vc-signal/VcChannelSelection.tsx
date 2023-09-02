import React, { useState, useEffect } from "react";
import {
    DiscordLinePost,
    SelectOption,
    LineSetChannels,
    VcSignalChannels,
    CategoryChannelType
} from '../../../store';
import {
    selectChannelAndThread,
    defalutChannelIdSelected
} from "../../../units/dictComprehension";
import Select,{ MultiValue } from "react-select";

import BoxCheck from "./CheckBoxForm";
import { CategoryChannel } from "discord.js";

interface VcChannelSelectionProps {
    discordCategoryChannel:CategoryChannelType[];
    vcChannelJson:VcSignalChannels;
    channelJson:LineSetChannels;
    roles:{id:string,name:string}[];
    activeThreads:{id:string,name:string}[];
    vcChannelSelect:(
        vcChannelSelect:SelectOption,
        categoryId:string,
        channelId:string
    ) => void;
}

const VcChannelSelection:React.FC<VcChannelSelectionProps> = ({
    discordCategoryChannel,
    vcChannelJson,
    channelJson,
    roles,
    activeThreads,
    vcChannelSelect
}) => {
    const threadAndChannels = selectChannelAndThread(
        discordCategoryChannel,
        channelJson,
        activeThreads
    );

    function VcRoleIdIndexComprehension(
        roleIdList:string[],
        roleList:{
            id:string,
            name:string
        }[]
    ){
        /*
        すでに選択されているロールを抜き取る
        */
        let optionDict: SelectOption;
        let optionList: SelectOption[] = [];
        roleList.forEach(role => {
            if (role.id in roleIdList){
                optionDict = {
                    value:role.id,
                    label:role.name
                }
                optionList.push(optionDict);
            }
        });
        return optionList;
    }

    return (
        <>
            {discordCategoryChannel.map((categoryChannel,index) => (
                <details key={categoryChannel.id}>
                    <summary>
                        <strong>{categoryChannel.name}</strong>
                    </summary>
                    <ul>
                        {vcChannelJson[discordCategoryChannel[index].id].map((vcChannel) => (
                            <details key={vcChannel.id}>
                                <summary>
                                    <strong>
                                        {vcChannel.name}
                                    </strong>
                                </summary>
                                <Select
                                    options={threadAndChannels}
                                    defaultValue={defalutChannelIdSelected(
                                        vcChannel.sendChannelId,
                                        threadAndChannels
                                    )}
                                    onChange={(value => (
                                        value &&
                                        vcChannelSelect(
                                            value,
                                            categoryChannel.id,
                                            vcChannel.id
                                        )
                                    ))}
                                ></Select>
                                <Select
                                    options={roles.map((role) => ({
                                        value:role.id,
                                        label:role.name
                                    }))}
                                    defaultValue={VcRoleIdIndexComprehension(
                                        vcChannel.mentionRoleId,
                                        roles
                                    )}
                                    isMulti // trueに
                                ></Select>
                            </details>
                        ))}
                    </ul>
                </details>
            ))}
        </>
    )
}

export default VcChannelSelection;