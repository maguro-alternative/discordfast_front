import React, { useState, useEffect, useMemo } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Select,{ MultiValue } from "react-select";

import {
    DiscordLinePost,
    SelectOption,
    Channels,
    CategoryChannelType
} from '../../../store';

import { UserIdComprehension } from "../../../units/dictComprehension";

import BoxCheck from "./CheckBoxForm";

interface CategoryChannelSectionProps {
    discordCategoryChannel:CategoryChannelType[];
    channelJson:Channels;
    userIdSelect:SelectOption[];
    messageTypeOption:SelectOption[];
    handleNgCheckChenge:(e:React.ChangeEvent<HTMLInputElement>) => void;
    handleBotCheckChenge:(e:React.ChangeEvent<HTMLInputElement>) => void;
    handleMessageTypeChenge:(
        ngMessageType:MultiValue<SelectOption>,
        categoryId:string,
        channelId:string
    ) => void;
    handleUserChenge:(
        ngUser:MultiValue<SelectOption>,
        categoryId:string,
        channelId:string
    ) => void;
    handleMessageTypeSet:(ngMessageType:string[]) => SelectOption[];
    handleUserSet:(ngUser:string[]) => SelectOption[];
}

const CategoryChannelSelection: React.FC<CategoryChannelSectionProps> = (
    {
        discordCategoryChannel,
        channelJson,
        userIdSelect,
        messageTypeOption,
        handleNgCheckChenge,
        handleBotCheckChenge,
        handleMessageTypeChenge,
        handleUserChenge,
        handleMessageTypeSet,
        handleUserSet
    }
) => {
    return(
        <>
            {discordCategoryChannel.map((categoryChannel,index) => (
                <details key={categoryChannel.id}>
                    <summary>
                        <strong>{categoryChannel.name}</strong>
                    </summary>
                    <ul>
                        {channelJson[discordCategoryChannel[index].id].map((channel) => (
                            <details key={channel.id}>
                                <summary>
                                    <strong>
                                        {channel.type === 'VoiceChannel' && `🔊:`}
                                        {channel.type === 'TextChannel' && `#:`}
                                        {channel.name}
                                    </strong>
                                </summary>
                                <BoxCheck
                                    channelBool={channel.lineNgChannel}
                                    channelId={channel.id}
                                    categoryChannelId={categoryChannel.id}
                                    labelText=":LINEへ送信しない"
                                    checkBoxCallback={handleNgCheckChenge}
                                ></BoxCheck>

                                <BoxCheck
                                    channelBool={channel.messageBot}
                                    channelId={channel.id}
                                    categoryChannelId={categoryChannel.id}
                                    labelText=":botのメッセージを送信しない"
                                    checkBoxCallback={handleBotCheckChenge}
                                ></BoxCheck>

                                <h5>送信しないメッセージの種類:</h5>
                                <Select
                                    options={messageTypeOption}
                                    defaultValue={handleMessageTypeSet(channel.ngMessageType)}
                                    onChange={(value) => {
                                        if(value){
                                            handleMessageTypeChenge(
                                                [...value],
                                                categoryChannel.id,
                                                channel.id
                                            )
                                        }else{
                                            null
                                        };
                                    }}
                                    isMulti // trueに
                                ></Select>

                                <h5>メッセージを送信しないユーザー</h5>
                                <Select
                                    options={userIdSelect}
                                    defaultValue={handleUserSet(channel.ngUsers)}
                                    onChange={(value) => {
                                        if(value){
                                            handleUserChenge(
                                                [...value],
                                                categoryChannel.id,
                                                channel.id
                                            )
                                        }else{
                                            null
                                        };
                                    }}
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

export default CategoryChannelSelection;