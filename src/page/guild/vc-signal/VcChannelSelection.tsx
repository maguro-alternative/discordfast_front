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
    vcRoleChannelSelect:(
        vcRoleSelect:MultiValue<SelectOption>,
        categoryId:string,
        channelId:string
    ) => void;
    handleCheckChange:(e:React.ChangeEvent<HTMLInputElement>) => void;
}

const VcChannelSelection:React.FC<VcChannelSelectionProps> = ({
    discordCategoryChannel,
    vcChannelJson,
    channelJson,
    roles,
    activeThreads,
    vcChannelSelect,
    vcRoleChannelSelect,
    handleCheckChange
}) => {
    /*
    ボイスチャンネルの選択

    discordCategoryChannel:カテゴリーのリスト
    vcChannelJson:ボイスチャンネルのリスト
    channelJson:チャンネルのリスト
    roles:ロールのリスト
    activeThreads:アクティブなスレッドのリスト
    vcChannelSelect:ボイスチャンネルの選択
    vcRoleChannelSelect:ボイスチャンネルのロールの選択
    handleCheckChange:チェックボックスの変更
    */
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
                                <h3>通知の送信先チャンネル</h3>
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
                                <h3>通知するロールの追加</h3>
                                <Select
                                    options={roles.map((role) => ({
                                        value:role.id,
                                        label:role.name
                                    }))}
                                    defaultValue={VcRoleIdIndexComprehension(
                                        vcChannel.mentionRoleId,
                                        roles
                                    )}
                                    onChange={(value => (
                                        value &&
                                        vcRoleChannelSelect(
                                            [...value],
                                            categoryChannel.id,
                                            vcChannel.id
                                        )
                                    ))}
                                    isMulti // trueに
                                ></Select>

                                <BoxCheck
                                    tagId={`everyoneMention${vcChannel.id}`}
                                    channelBool={vcChannel.everyoneMention}
                                    channelId={vcChannel.id}
                                    categoryChannelId={categoryChannel.id}
                                    labelText=":everyoneで通知をする"
                                    checkBoxCallback={handleCheckChange}
                                ></BoxCheck>

                                <BoxCheck
                                    tagId={`joinBot${vcChannel.id}`}
                                    channelBool={vcChannel.joinBot}
                                    channelId={vcChannel.id}
                                    categoryChannelId={categoryChannel.id}
                                    labelText=":Botが入室したら通知をする"
                                    checkBoxCallback={handleCheckChange}
                                ></BoxCheck>
                            </details>
                        ))}
                    </ul>
                </details>
            ))}
        </>
    )
}

export default VcChannelSelection;