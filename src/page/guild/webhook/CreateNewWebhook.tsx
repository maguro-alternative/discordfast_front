import React, { useState, useEffect } from "react";
import Select,{ MultiValue } from "react-select";

import { DiscordWebhook,SelectOption } from '../../../store';

interface CreateNewWebhookSelectionProps {
    newUuids:string[],
    webhookSet:DiscordWebhook,
    newWebhookSetting:() => void;
    handleNewWebhookChange:(
        webhookKind:SelectOption,
        uuid:string
    ) => void;
    handleNewWebhookRoleChange:(
        webhookRoles:MultiValue<SelectOption>,
        uuid:string
    ) => void;
    handleNewWebhookUserChange:(
        webhookUsers:MultiValue<SelectOption>,
        uuid:string
    ) => void;
    handleNewWebhookInputChange:(e: React.ChangeEvent<HTMLInputElement>) => void;
    handleNewWebhookInputArray:(
        inputName:string,
        uuid:string,
        popIndex?:number
    ) => void;
}

const CreateNewWebhookSelection:React.FC<CreateNewWebhookSelectionProps> = ({
    newUuids,
    webhookSet,
    newWebhookSetting,
    handleNewWebhookChange,
    handleNewWebhookRoleChange,
    handleNewWebhookUserChange,
    handleNewWebhookInputChange,
    handleNewWebhookInputArray
}) => {
    if (newUuids.length === 0){
        newWebhookSetting();
    }
    const webhookSelects = webhookSet.webhooks.map((webhook) => ({
        value:webhook.id,
        label:`${webhook.channelName}:${webhook.name}`
    }));
    const webhookRoles = webhookSet.guildRoles.map((role) => ({
        value:role.id,
        label:role.name
    }));
    const webhookUsers = webhookSet.guildUsers.map((user) => ({
        value:user.id,
        label:`${user.userDisplayName}:${user.name}`
    }))

    const newCreateWebhook = webhookSet.webhookSet.filter((newWebhook) => {
        if (newUuids.includes(newWebhook.uuid)){
            return newWebhook
        }
    })

    return(
        <details>
            <summary>
                <strong>新規作成</strong>
            </summary>
            {newCreateWebhook.map((newWebhook) => (
                <div key={newWebhook.uuid}>
                    <h6>WebHook</h6>
                    <Select
                        options={webhookSelects}
                        onChange={(value) => {
                            if(value){
                                handleNewWebhookChange(
                                    value,
                                    newWebhook.uuid
                                )
                            }
                        }}
                    ></Select>

                    <h6>サブスクリプションタイプ(例:twitter,niconico)</h6>
                    <input type="text" id={`subscType${newWebhook.uuid}`} name="subscType_1"/>

                    <h6>サブスクリプションid(例:twitter:@ユーザ名(@は含まない),niconico:/user/userId)</h6>
                    <input type="text" id={`subscId${newWebhook.uuid}`} name="subscId_1"/>

                    <h6>メンションするロールの選択</h6>
                    <Select
                        options={webhookRoles}
                        onChange={(value) => {
                            if(value){
                                handleNewWebhookRoleChange(
                                    [...value],
                                    newWebhook.uuid
                                )
                            }
                        }}
                        isMulti // trueに
                    ></Select>

                    <h6>メンションするメンバーの選択</h6>
                    <Select
                        options={webhookUsers}
                        onChange={(value) => {
                            if(value){
                                handleNewWebhookUserChange(
                                    [...value],
                                    newWebhook.uuid
                                )
                            }
                        }}
                        isMulti // trueに
                    ></Select>

                    <h3>ワードカスタム(niconicoには反映されません)</h3>
                    <h6>キーワードOR検索(いずれかの言葉が含まれている場合、送信)</h6>
                    {newWebhook.mention_or_word.map((mOrWord,index) => (
                        <div key={`${mOrWord}${index}`}>
                            <label>検索条件:{index + 1}</label>
                            <input
                                id={`mentionOrWord${newWebhook.uuid}`}
                                name={`${index}`}
                                type="text"
                                value={mOrWord}
                                onChange={handleNewWebhookInputChange}
                            ></input>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleNewWebhookInputArray(
                            "mentionOrWord",
                            newWebhook.uuid
                        )}
                    >条件追加</button>
                </div>
            ))}
        </details>
    );
}

export default CreateNewWebhookSelection;