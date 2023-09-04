import React, { useState, useEffect } from "react";
import Select,{ MultiValue } from "react-select";

import { DiscordWebhook } from '../../../store';

interface CreateNewWebhookSelectionProps {
    newUuids:string[],
    webhookSet:DiscordWebhook,
    newWebhookSetting:() => void;
    handleNewWebhookChange:() => void;
    handleNewWebhookRoleChange:() => void;
    handleNewWebhookUserChange:() => void;
    handleNewWebhookInputChange:(e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CreateNewWebhookSelection:React.FC<CreateNewWebhookSelectionProps> = ({
    newUuids,
    webhookSet,
    newWebhookSetting,
    handleNewWebhookChange,
    handleNewWebhookRoleChange,
    handleNewWebhookUserChange,
    handleNewWebhookInputChange
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
                        onChange={handleNewWebhookChange}
                    ></Select>

                    <h6>サブスクリプションタイプ(例:twitter,niconico)</h6>
                    <input type="text" id={`subscType${newWebhook.uuid}`} name="subscType_1"/>

                    <h6>サブスクリプションid(例:twitter:@ユーザ名(@は含まない),niconico:/user/userId)</h6>
                    <input type="text" id={`subscId${newWebhook.uuid}`} name="subscId_1"/>

                    <h6>メンションするロールの選択</h6>
                    <Select
                        options={webhookRoles}
                        onChange={handleNewWebhookRoleChange}
                        isMulti // trueに
                    ></Select>

                    <h6>メンションするメンバーの選択</h6>
                    <Select
                        options={webhookUsers}
                        onChange={handleNewWebhookUserChange}
                        isMulti // trueに
                    ></Select>

                    <h3>ワードカスタム(niconicoには反映されません)</h3>
                    <h6>キーワードOR検索(いずれかの言葉が含まれている場合、送信)</h6>
                    {newWebhook.mention_or_word.map((mOrWord,index) => (
                        <div key={mOrWord}>
                            <label>検索条件:{index}</label>
                            <input id={`searchOrWord${newWebhook.uuid}`} name={`${index}`} type="text" onChange={handleNewWebhookInputChange}></input>
                        </div>
                    ))}
                    <button type="button">条件追加</button>
                </div>
            ))}
        </details>
    );
}

export default CreateNewWebhookSelection;