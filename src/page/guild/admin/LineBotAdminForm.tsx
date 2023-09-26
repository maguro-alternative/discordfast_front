import React, { useEffect, useState } from "react";
import Select from "react-select";

import { SelectOption } from '../../../store';
import {
    UserIdIndexOptionComprehension,
    RoleIdIndexOptionComprehension
} from "../../../units/dictComprehension";

interface LineAdminFormProps {
    lineBotPermission   : number;
    guildMember         : SelectOption[];
    guildRole           : SelectOption[];
    lineBotUserIds      : string[];
    lineBotRoleIds      : string[];
    selectCallback      : (selectedValues:SelectOption[],selectType:string) => void;
    textCallback        : (e:React.ChangeEvent<HTMLInputElement>) => void;
}

const LineBotAdminForm: React.FC<LineAdminFormProps> = ({
    lineBotPermission,
    guildMember,
    guildRole,
    lineBotUserIds,
    lineBotRoleIds,
    selectCallback,
    textCallback
}) => {
    const [useInitialCallback, setUseInitialCallback] = useState(true); // サーバーからデータを取得する前か
    const lineBotUserIdSelected = UserIdIndexOptionComprehension(lineBotUserIds,guildMember);   // lineの送信設定を許可されているユーザid一覧

    const lineRoleIdSelected = RoleIdIndexOptionComprehension(lineBotRoleIds,guildRole); // lineの送信設定を許可されているロールid一覧

    // すでに設定されている要素を設定
    const [selectedLineBotUserValue, setSelectedLineBotUserValue] = useState(lineBotUserIdSelected);
    const [selectedLineBotRoleValue, setSelectedLineBotRoleValue] = useState(lineRoleIdSelected);

    // すでに設定されている要素を設定
    if (useInitialCallback){
        selectCallback(selectedLineBotUserValue,'user');
        selectCallback(selectedLineBotRoleValue,'role');
        setUseInitialCallback(false);
    }

    // 非同期でのstate更新に合わせるため
    useEffect(() => {
        selectCallback(selectedLineBotUserValue,'user');
    },[selectedLineBotUserValue]);

    useEffect(() => {
        selectCallback(selectedLineBotRoleValue,'role');
    },[selectedLineBotRoleValue]);

    return (
        <details>
            <summary>
                <strong>LINEBotおよびグループ設定</strong>
            </summary>
            <div>
                <label>編集を許可する権限コード</label>
                <input
                    type="text"
                    name="line_bot_permission"
                    defaultValue={lineBotPermission}
                    onChange={textCallback}
                />
            </div>
            <h6>アクセスを許可するメンバーの選択</h6>
            <div style={{ width: "500px", margin: "50px" }}>
                <Select
                    className="select-bar"
                    options={guildMember}
                    defaultValue={selectedLineBotUserValue}
                    onChange={(value) => {
                        if(value){
                            setSelectedLineBotUserValue([...value]);
                        }
                        selectCallback(selectedLineBotUserValue,'user');
                    }}
                    isMulti // trueに
                />
            </div>
            <h6>アクセスを許可するロールの選択</h6>
            <div style={{ width: "500px", margin: "50px" }}>
                <Select
                    className="select-bar"
                    options={guildRole}
                    defaultValue={selectedLineBotRoleValue}
                    onChange={(value) => {
                        if(value){
                            setSelectedLineBotRoleValue([...value]);
                        }
                        selectCallback(selectedLineBotRoleValue,'role');
                    }}
                    isMulti // trueに
                />
            </div>
        </details>
    )
};

export default LineBotAdminForm;