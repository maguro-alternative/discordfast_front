import React, { useEffect, useState } from "react";
import Select from "react-select";

import { SelectOption } from '../../../store';
import {
    UserIdIndexOptionComprehension,
    RoleIdIndexOptionComprehension
} from "../../../units/dictComprehension";

interface WebhookAdminFormProps {
    webhookPermission   : number;
    guildMember         : SelectOption[];
    guildRole           : SelectOption[];
    webhookUserIds      : string[];
    webhookRoleIds      : string[];
    selectCallback      : (selectedValues:SelectOption[],selectType:string) => void;
    textCallback        : (e:React.ChangeEvent<HTMLInputElement>) => void;
}

const WebhookAdminForm: React.FC<WebhookAdminFormProps> = ({
    webhookPermission,
    guildMember,
    guildRole,
    webhookUserIds,
    webhookRoleIds,
    selectCallback,
    textCallback
}) => {
    const [useInitialCallback, setUseInitialCallback] = useState(true); // サーバーからデータを取得する前か
    const webhookUserIdSelected = UserIdIndexOptionComprehension(webhookUserIds,guildMember);   // lineの送信設定を許可されているユーザid一覧

    const webhookRoleIdSelected = RoleIdIndexOptionComprehension(webhookRoleIds,guildRole); // lineの送信設定を許可されているロールid一覧

    // すでに設定されている要素を設定
    const [selectedWebhookUserValue, setSelectedWebhookUserValue] = useState(webhookUserIdSelected);
    const [selectedWebhookRoleValue, setSelectedWebhookRoleValue] = useState(webhookRoleIdSelected);

    // すでに設定されている要素を設定
    if (useInitialCallback){
        selectCallback(selectedWebhookUserValue,'user');
        selectCallback(selectedWebhookRoleValue,'role');
        setUseInitialCallback(false);
    }

    // 非同期でのstate更新に合わせるため
    useEffect(() => {
        selectCallback(selectedWebhookUserValue,'user');
    },[selectedWebhookUserValue]);

    useEffect(() => {
        selectCallback(selectedWebhookRoleValue,'role');
    },[selectedWebhookRoleValue]);

    return (
        <details>
            <summary>
                <strong>Webhookの通知設定</strong>
            </summary>
            <div>
                <label>編集を許可する権限コード</label>
                <input
                    type="text"
                    name="webhook_permission"
                    defaultValue={webhookPermission}
                    onChange={textCallback}
                />
            </div>
            <h6>アクセスを許可するメンバーの選択</h6>
            <div style={{ width: "500px", margin: "50px" }}>
                <Select
                    options={guildMember}
                    defaultValue={selectedWebhookUserValue}
                    onChange={(value) => {
                        if(value){
                            setSelectedWebhookUserValue([...value]);
                        }else{
                            undefined
                        };
                        selectCallback(selectedWebhookUserValue,'user');
                    }}
                    isMulti // trueに
                />
            </div>
            <h6>アクセスを許可するロールの選択</h6>
            <div style={{ width: "500px", margin: "50px" }}>
                <Select
                    options={guildRole}
                    defaultValue={selectedWebhookRoleValue}
                    onChange={(value) => {
                        if(value){
                            setSelectedWebhookRoleValue([...value]);
                        }else{
                            undefined
                        };
                        selectCallback(selectedWebhookRoleValue,'role');
                    }}
                    isMulti // trueに
                />
            </div>
        </details>
    )
};

export default WebhookAdminForm;