import React, { useState, useEffect } from "react";
import Select,{ MultiValue } from "react-select";

import { DiscordWebhook } from '../../../store';

interface CreateNewWebhookSelectionProps {
    uuids:string[],
    webhookSet:DiscordWebhook,
    newWebhookSetting:() => void;
    handleNewWebhookChange:() => void;
    handleNewWebhookRoleChange:() => void;
    handleNewWebhookUserChange:() => void;
}

const CreateNewWebhookSelection:React.FC<CreateNewWebhookSelectionProps> = ({
    uuids,
    webhookSet,
    newWebhookSetting,
    handleNewWebhookChange,
    handleNewWebhookRoleChange,
    handleNewWebhookUserChange
}) => {
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
    return(
        <>
            {uuids.map((uuid) => (
                <div key={uuid}>
                    <h6>WebHook</h6>
                    <Select
                        options={webhookSelects}
                        onChange={handleNewWebhookChange}
                    ></Select>

                    <h6>サブスクリプションタイプ(例:twitter,niconico)</h6>
                    <input type="text" id={`subscType${uuid}`} name="subscType_1"/>

                    <h6>サブスクリプションid(例:twitter:@ユーザ名(@は含まない),niconico:/user/userId)</h6>
                    <input type="text" id={`subscId${uuid}`} name="subscId_1"/>

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
                </div>
            ))}
        </>
    );
}