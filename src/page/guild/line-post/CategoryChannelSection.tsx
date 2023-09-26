import React from "react";

import Select,{ MultiValue } from "react-select";

import {
    SelectOption,
    CategoryChannelType
} from '../../../store';

import BoxCheck from "./CheckBoxForm";

interface LinePostChannels {
    [id:string]: {
        id: string;
        name: string;
        type: string;
        lineNgChannel: boolean;
        ngMessageType: string[];
        messageBot: boolean;
        ngUsers: string[];
    }[]
}


interface CategoryChannelSectionProps {
    discordCategoryChannel:CategoryChannelType[];
    channelJson:LinePostChannels;
    userIdSelect:SelectOption[];
    messageTypeOption:SelectOption[];
    chengePermission:boolean;
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
    handleMessageTypeSet:(
        ngMessageType:string[],
        selectOptions:SelectOption[]
    ) => SelectOption[];
    handleUserSet:(
        ngUser:string[],
        selectOptions:SelectOption[]
    ) => SelectOption[];
}

const CategoryChannelSelection: React.FC<CategoryChannelSectionProps> = (
    {
        discordCategoryChannel,
        channelJson,
        userIdSelect,
        messageTypeOption,
        chengePermission,
        handleNgCheckChenge,
        handleBotCheckChenge,
        handleMessageTypeChenge,
        handleUserChenge,
        handleMessageTypeSet,
        handleUserSet
    }
) => {
    /*
    カテゴリー内のチャンネルを表示する

    discordCategoryChannel:カテゴリーのリスト
    channelJson:チャンネルのリスト
    userIdSelect:ユーザーのリスト
    messageTypeOption:メッセージの種類のリスト
    handleNgCheckChenge:LINEへ送信しないチェックボックスの変更時の関数
    handleBotCheckChenge:botのメッセージを送信しないチェックボックスの変更時の関数
    handleMessageTypeChenge:送信しないメッセージの種類の変更時の関数
    handleUserChenge:送信しないユーザーの変更時の関数
    handleMessageTypeSet:送信しないメッセージの種類の初期値の設定
    handleUserSet:送信しないユーザーの初期値の設定
    */
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
                                    tagId={`ngChannel${channel.id}`}
                                    channelBool={channel.lineNgChannel}
                                    channelId={channel.id}
                                    categoryChannelId={categoryChannel.id}
                                    labelText=":LINEへ送信しない"
                                    chengePermission={chengePermission}
                                    checkBoxCallback={handleNgCheckChenge}
                                ></BoxCheck>

                                <BoxCheck
                                    tagId={`ngBot${channel.id}`}
                                    channelBool={channel.messageBot}
                                    channelId={channel.id}
                                    categoryChannelId={categoryChannel.id}
                                    labelText=":botのメッセージを送信しない"
                                    chengePermission={chengePermission}
                                    checkBoxCallback={handleBotCheckChenge}
                                ></BoxCheck>

                                <h5>送信しないメッセージの種類:</h5>
                                <Select
                                    className="select-bar"
                                    options={messageTypeOption}
                                    defaultValue={handleMessageTypeSet(
                                        channel.ngMessageType,
                                        messageTypeOption
                                    )}
                                    onChange={(value) => {
                                        if(value){
                                            handleMessageTypeChenge(
                                                [...value],
                                                categoryChannel.id,
                                                channel.id
                                            )
                                        }
                                    }}
                                    isMulti // trueに
                                    {...chengePermission ? {} : {isDisabled:true}}
                                ></Select>

                                <h5>メッセージを送信しないユーザー</h5>
                                <Select
                                    className="select-bar"
                                    options={userIdSelect}
                                    defaultValue={handleUserSet(
                                        channel.ngUsers,
                                        userIdSelect
                                    )}
                                    onChange={(value) => {
                                        if(value){
                                            handleUserChenge(
                                                [...value],
                                                categoryChannel.id,
                                                channel.id
                                            )
                                        }
                                    }}
                                    isMulti // trueに
                                    {...chengePermission ? {} : {isDisabled:true}}
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