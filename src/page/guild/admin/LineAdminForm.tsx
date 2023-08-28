import React, { useEffect, useState } from "react";
import Select from "react-select";

import { SelectOption } from '../../../store';
import {
    UserIdIndexOptionComprehension,
    RoleIdIndexOptionComprehension
} from "../../../units/dictComprehension";

interface LineAdminFormProps {
    line_permission : number;
    guildMember     : SelectOption[];
    guildRole       : SelectOption[];
    lineUserIds     : string[];
    lineRoleIds     : string[];
    selectCallback  : (selectedValues:SelectOption[],selectType:string) => void;
}

const LineAdminForm: React.FC<LineAdminFormProps> = ({
    line_permission,
    guildMember,
    guildRole,
    lineUserIds,
    lineRoleIds,
    selectCallback
}) => {
    const [useInitialCallback, setUseInitialCallback] = useState(true); // サーバーからデータを取得する前か
    const lineUserIdSelected = UserIdIndexOptionComprehension(lineUserIds,guildMember);   // lineの送信設定を許可されているユーザid一覧

    const lineRoleIdSelected = RoleIdIndexOptionComprehension(lineRoleIds,guildRole); // lineの送信設定を許可されているロールid一覧

    // すでに設定されている要素を設定
    const [selectedLineUserValue, setSelectedLineUserValue] = useState(lineUserIdSelected);
    const [selectedLineRoleValue, setSelectedLineRoleValue] = useState(lineRoleIdSelected);

    // すでに設定されている要素を設定
    if (useInitialCallback){
        console.log('call');
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
                    defaultValue={line_permission}
                />
            </div>
            <h6>アクセスを許可するメンバーの選択</h6>
            <div style={{ width: "500px", margin: "50px" }}>
                <Select
                    options={guildMember}
                    defaultValue={selectedLineUserValue}
                    onChange={(value) => {
                        if(value){
                            setSelectedLineUserValue([...value]);
                        }else{
                            null;
                        };
                        selectCallback(selectedLineUserValue,'user');
                    }}
                    isMulti // trueに
                />
            </div>
            <h6>アクセスを許可するロールの選択</h6>
            <div style={{ width: "500px", margin: "50px" }}>
                <Select
                    options={guildRole}
                    defaultValue={selectedLineRoleValue}
                    onChange={(value) => {
                        if(value){
                            setSelectedLineRoleValue([...value]);
                        }else{
                            null
                        };
                        selectCallback(selectedLineRoleValue,'role');
                    }}
                    isMulti // trueに
                />
            </div>
        </details>
    )
};

export default LineAdminForm;