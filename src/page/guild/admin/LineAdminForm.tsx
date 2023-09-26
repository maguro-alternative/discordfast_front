import React, { useEffect, useState } from "react";
import Select from "react-select";

import { SelectOption } from '../../../store';
import {
    UserIdIndexOptionComprehension,
    RoleIdIndexOptionComprehension
} from "../../../units/dictComprehension";

interface LineAdminFormProps {
    linePermission : number;
    guildMember     : SelectOption[];
    guildRole       : SelectOption[];
    lineUserIds     : string[];
    lineRoleIds     : string[];
    selectCallback  : (selectedValues:SelectOption[],selectType:string) => void;
    textCallback    : (e:React.ChangeEvent<HTMLInputElement>) => void;
}

const LineAdminForm: React.FC<LineAdminFormProps> = ({
    linePermission,
    guildMember,
    guildRole,
    lineUserIds,
    lineRoleIds,
    selectCallback,
    textCallback
}) => {
    const [useInitialCallback, setUseInitialCallback] = useState(true); // サーバーからデータを取得する前か
    const lineUserIdSelected = UserIdIndexOptionComprehension(lineUserIds,guildMember);   // lineの送信設定を許可されているユーザid一覧

    const lineRoleIdSelected = RoleIdIndexOptionComprehension(lineRoleIds,guildRole); // lineの送信設定を許可されているロールid一覧

    // すでに設定されている要素を設定
    const [selectedLineUserValue, setSelectedLineUserValue] = useState(lineUserIdSelected);
    const [selectedLineRoleValue, setSelectedLineRoleValue] = useState(lineRoleIdSelected);

    // すでに設定されている要素を設定
    if (useInitialCallback){
        selectCallback(selectedLineUserValue,'user');
        selectCallback(selectedLineRoleValue,'role');
        setUseInitialCallback(false);
    }

    // 非同期でのstate更新に合わせるため
    useEffect(() => {
        selectCallback(selectedLineUserValue,'user');
    },[selectedLineUserValue]);

    useEffect(() => {
        selectCallback(selectedLineRoleValue,'role');
    },[selectedLineRoleValue]);

    return (
        <details>
            <summary>
                <strong>LINEへの送信設定</strong>
            </summary>
            <div>
                <label>編集を許可する権限コード</label>
                <input
                    type="text"
                    name="line_permission"
                    defaultValue={linePermission}
                    onChange={textCallback}
                />
            </div>
            <h6>アクセスを許可するメンバーの選択</h6>
            <div style={{ width: "500px", margin: "50px" }}>
                <Select
                    className="select-bar"
                    options={guildMember}
                    defaultValue={selectedLineUserValue}
                    onChange={(value) => {
                        if(value){
                            setSelectedLineUserValue([...value]);
                        }
                        selectCallback(selectedLineUserValue,'user');
                    }}
                    isMulti // trueに
                />
            </div>
            <h6>アクセスを許可するロールの選択</h6>
            <div style={{ width: "500px", margin: "50px" }}>
                <Select
                    className="select-bar"
                    options={guildRole}
                    defaultValue={selectedLineRoleValue}
                    onChange={(value) => {
                        if(value){
                            setSelectedLineRoleValue([...value]);
                        }
                        selectCallback(selectedLineRoleValue,'role');
                    }}
                    isMulti // trueに
                />
            </div>
        </details>
    )
};

export default LineAdminForm;