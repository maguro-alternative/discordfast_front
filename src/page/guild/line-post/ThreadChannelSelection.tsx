import React from "react";

import Select,{ MultiValue } from "react-select";

import {
    SelectOption
} from '../../../store';

interface LinePostChannel {
    id: string;
    name: string;
    type: string;
    lineNgChannel: boolean;
    ngMessageType: string[];
    messageBot: boolean;
    ngUsers: string[];
}


import BoxCheck from "./CheckBoxForm";

interface ThreadChannelSectionProps {
    discordThreads:LinePostChannel[];
    userIdSelect:SelectOption[];
    messageTypeOption:SelectOption[];
    handleThreadNgCheckChenge:(e:React.ChangeEvent<HTMLInputElement>) => void;
    handleThreadBotCheckChenge:(e:React.ChangeEvent<HTMLInputElement>) => void;
    handleThreadMessageTypeChenge:(
        ngMessageType:MultiValue<SelectOption>,
        categoryId:string,
        channelId:string
    ) => void;
    handleThreadUserChenge:(
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

const ThreadCategoryChannelSelection: React.FC<ThreadChannelSectionProps> = (
    {
        discordThreads,
        userIdSelect,
        messageTypeOption,
        handleThreadNgCheckChenge,
        handleThreadBotCheckChenge,
        handleThreadMessageTypeChenge,
        handleThreadUserChenge,
        handleMessageTypeSet,
        handleUserSet
    }
) => {
    /*
    スレッドのチャンネル選択

    discordThreads:スレッドのチャンネル情報
    userIdSelect:ユーザーの選択肢
    messageTypeOption:メッセージタイプの選択肢
    handleThreadNgCheckChenge:スレッドのチェックボックスの変更
    handleThreadBotCheckChenge:スレッドのbotチェックボックスの変更
    handleThreadMessageTypeChenge:スレッドのメッセージタイプの変更
    handleThreadUserChenge:スレッドのユーザーの変更
    handleMessageTypeSet:メッセージタイプの初期値
    handleUserSet:ユーザーの初期値
    */
    return(
        <details>
            <summary>
                <strong>スレッド一覧</strong>
            </summary>
            <ul>
                {discordThreads.map((thread,index) => (
                    <details key={thread.id}>
                        <summary>
                            <strong>{thread.name}</strong>
                        </summary>
                            <BoxCheck
                                tagId={`ngChannelThread${thread.id}`}
                                channelBool={thread.lineNgChannel}
                                channelId={thread.id}
                                categoryChannelId=""
                                labelText=":LINEへ送信しない"
                                checkBoxCallback={handleThreadNgCheckChenge}
                            ></BoxCheck>
                            <BoxCheck
                                tagId={`ngBotThread${thread.id}`}
                                channelBool={thread.messageBot}
                                channelId={thread.id}
                                categoryChannelId=""
                                labelText=":botのメッセージを送信しない"
                                checkBoxCallback={handleThreadBotCheckChenge}
                            ></BoxCheck>

                            <h5>送信しないメッセージの種類:</h5>
                            <Select
                                options={messageTypeOption}
                                defaultValue={handleMessageTypeSet(
                                    thread.ngMessageType,
                                    messageTypeOption
                                )}
                                onChange={(value) => {
                                    if(value){
                                        handleThreadMessageTypeChenge(
                                            [...value],
                                            "Thread",
                                            thread.id
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
                                defaultValue={handleUserSet(
                                    thread.ngUsers,
                                    userIdSelect
                                )}
                                onChange={(value) => {
                                    if(value){
                                        handleThreadUserChenge(
                                            [...value],
                                            "Thread",
                                            thread.id
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
    )
}

export default ThreadCategoryChannelSelection;