import React, { useState } from "react";
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
}

const LineAdminForm: React.FC<LineAdminFormProps> = ({
    line_permission,
    guildMember,
    guildRole,
    lineUserIds,
    lineRoleIds
}) => {

    const lineUserIdSelected = UserIdIndexOptionComprehension(lineUserIds,guildMember);   // lineの送信設定を許可されているユーザid一覧

    const lineRoleIdSelected = RoleIdIndexOptionComprehension(lineRoleIds,guildRole); // lineの送信設定を許可されているロールid一覧

    // すでに設定されている要素を設定
    const [selectedLineUserValue, setSelectedLineUserValue] = useState(lineUserIdSelected);
    const [selectedLineRoleValue, setSelectedLineRoleValue] = useState(lineRoleIdSelected);

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
                        value ? setSelectedLineUserValue([...value]) : null;
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
                        value ? setSelectedLineRoleValue([...value]) : null;
                    }}
                    isMulti // trueに
                />
            </div>
        </details>
    )
};

export default LineAdminForm;