import React from "react";

import Select,{ MultiValue } from "react-select";

import {
    SelectOption
} from '../../../store';

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
import BoxCheck from "./CheckBoxForm";

interface NoneCategoryChannelSectionProps {
    channelJson:LinePostChannels;
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
    handleMessageTypeSet:(
        ngMessageType:string[],
        selectOptions:SelectOption[]
    ) => SelectOption[];
    handleUserSet:(
        ngUser:string[],
        selectOptions:SelectOption[]
    ) => SelectOption[];
}

const NoneCategoryChannelSelection: React.FC<NoneCategoryChannelSectionProps> = (
    {
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
    /*
    カテゴリーなしのチャンネルを表示する

    channelJson:カテゴリーなしのチャンネルの項目
    userIdSelect:ユーザーのリスト
    messageTypeOption:メッセージの種類のリスト
    handleNgCheckChenge:LINEへ送信しないのチェックボックスの変更
    handleBotCheckChenge:botのメッセージを送信しないのチェックボックスの変更
    handleMessageTypeChenge:メッセージの種類の変更
    handleUserChenge:ユーザーの変更
    handleMessageTypeSet:メッセージの種類の初期値の設定
    handleUserSet:ユーザーの初期値の設定
    */
    return(
        <>
            {channelJson["None"].length > 0 ? (
                <details>
                    <summary>
                        <strong>カテゴリーなし</strong>
                    </summary>
                    <ul>
                        {channelJson["None"].map((channel) => (
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
                                    categoryChannelId={"None"}
                                    labelText=":LINEへ送信しない"
                                    checkBoxCallback={handleNgCheckChenge}
                                ></BoxCheck>

                                <BoxCheck
                                    tagId={`ngBot${channel.id}`}
                                    channelBool={channel.messageBot}
                                    channelId={channel.id}
                                    categoryChannelId={"None"}
                                    labelText=":botのメッセージを送信しない"
                                    checkBoxCallback={handleBotCheckChenge}
                                ></BoxCheck>

                                <h5>送信しないメッセージの種類:</h5>
                                <Select
                                    options={messageTypeOption}
                                    defaultValue={handleMessageTypeSet(
                                        channel.ngMessageType,
                                        messageTypeOption
                                    )}
                                    onChange={(value) => {
                                        if(value){
                                            handleMessageTypeChenge(
                                                [...value],
                                                "None",
                                                channel.id
                                            )
                                        }
                                    }}
                                    isMulti // trueに
                                ></Select>

                                <h5>メッセージを送信しないユーザー</h5>
                                <Select
                                    options={userIdSelect}
                                    defaultValue={handleUserSet(
                                        channel.ngUsers,
                                        userIdSelect
                                    )}
                                    onChange={(value) => {
                                        if(value){
                                            handleUserChenge(
                                                [...value],
                                                "None",
                                                channel.id
                                            )
                                        }
                                    }}
                                    isMulti // trueに
                                ></Select>
                            </details>
                        ))}
                    </ul>
                </details>
            ):(<></>)}
        </>
    )
}

export default NoneCategoryChannelSelection;