import React, { useEffect, useState } from "react";
import Select from "react-select";

import { SelectOption } from '../../../store';
import {
    UserIdIndexOptionComprehension,
    RoleIdIndexOptionComprehension
} from "../../../units/dictComprehension";

interface VcAdminFormProps {
    vcPermission    : number;
    guildMember     : SelectOption[];
    guildRole       : SelectOption[];
    vcUserIds       : string[];
    vcRoleIds       : string[];
    selectCallback  : (selectedValues:SelectOption[],selectType:string) => void;
    textCallback    : (e:React.ChangeEvent<HTMLInputElement>) => void;
}

const VcAdminForm: React.FC<VcAdminFormProps> = ({
    vcPermission,
    guildMember,
    guildRole,
    vcUserIds,
    vcRoleIds,
    selectCallback,
    textCallback
}) => {
    const [useInitialCallback, setUseInitialCallback] = useState(true); // サーバーからデータを取得する前か
    const vcUserIdSelected = UserIdIndexOptionComprehension(vcUserIds,guildMember);   // lineの送信設定を許可されているユーザid一覧

    const vcRoleIdSelected = RoleIdIndexOptionComprehension(vcRoleIds,guildRole); // lineの送信設定を許可されているロールid一覧

    // すでに設定されている要素を設定
    const [selectedVcUserValue, setSelectedVcUserValue] = useState(vcUserIdSelected);
    const [selectedVcRoleValue, setSelectedVcRoleValue] = useState(vcRoleIdSelected);

    // すでに設定されている要素を設定
    if (useInitialCallback){
        selectCallback(selectedVcUserValue,'user');
        selectCallback(selectedVcRoleValue,'role');
        setUseInitialCallback(false);
    }

    // 非同期でのstate更新に合わせるため
    useEffect(() => {
        selectCallback(selectedVcUserValue,'user');
    },[selectedVcUserValue]);

    useEffect(() => {
        selectCallback(selectedVcRoleValue,'role');
    },[selectedVcRoleValue]);

    return (
        <details>
            <summary>
                <strong>ボイスチャンネルの通知設定</strong>
            </summary>
            <div>
                <label>編集を許可する権限コード</label>
                <input
                    type="text"
                    name="vc_permission"
                    defaultValue={vcPermission}
                    onChange={textCallback}
                />
            </div>
            <h6>アクセスを許可するメンバーの選択</h6>
            <div style={{ width: "500px", margin: "50px" }}>
                <Select
                    options={guildMember}
                    defaultValue={selectedVcUserValue}
                    onChange={(value) => {
                        if(value){
                            setSelectedVcUserValue([...value]);
                        }else{
                            null;
                        };
                        selectCallback(selectedVcUserValue,'user');
                    }}
                    isMulti // trueに
                />
            </div>
            <h6>アクセスを許可するロールの選択</h6>
            <div style={{ width: "500px", margin: "50px" }}>
                <Select
                    options={guildRole}
                    defaultValue={selectedVcRoleValue}
                    onChange={(value) => {
                        if(value){
                            setSelectedVcRoleValue([...value]);
                        }else{
                            null
                        };
                        selectCallback(selectedVcRoleValue,'role');
                    }}
                    isMulti // trueに
                />
            </div>
        </details>
    )
};

export default VcAdminForm;