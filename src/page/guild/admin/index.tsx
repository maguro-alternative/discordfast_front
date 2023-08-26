import React, { useState, useEffect } from "react";
import Select from "react-select";
import AsyncSelect from 'react-select/async'
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { DiscordAdmin } from '../../../store';
import {
    UserIdComprehension,
    UserIdIndexComprehension,
    RoleIdComprehension,
    RoleIdIndexComprehension
} from "../../../units/dictComprehension";

interface AdminFormData {
    guild_id                    : bigint;
    line_permission             : number;
    line_user_id_permission     : string[];
    line_role_id_permission     : string[];
    line_bot_permission         : number;
    line_bot_user_id_permission : string[];
    line_bot_role_id_permission : string[];
    vc_permission               : number;
    vc_user_id_permission       : string[];
    vc_role_id_permission       : string[];
    webhook_permission          : number;
    webhook_user_id_permission  : string[];
    webhook_role_id_permission  : string[];
}

const Admin = () => {
    const { id } = useParams(); // パラメータを取得

    const [adminData, setAdminData] = useState<DiscordAdmin>();
    const [isLoading, setIsLoading] = useState(true);

    const guildMember = adminData && adminData.guildMembers !== undefined ? adminData.guildMembers : [];
    const guildRole = adminData && adminData.guildRoles !== undefined ? adminData.guildRoles : [];

    const lineUserIds = adminData && adminData.lineUserIdPermission !== undefined ? adminData.lineUserIdPermission : [];
    const lineRoleIds = adminData && adminData.lineRoleIdPermission !== undefined ? adminData.lineRoleIdPermission : [];
    const lineBotUserIds = adminData && adminData.lineBotUserIdPermission !== undefined ? adminData.lineBotUserIdPermission : [];
    const lineBotRoleIds = adminData && adminData.lineBotRoleIdPermission !== undefined ? adminData.lineBotRoleIdPermission : [];
    const vcUserIds = adminData && adminData.vcUserIdPermission !== undefined ? adminData.vcUserIdPermission : [];
    const vcRoleIds = adminData && adminData.vcRoleIdPermission !== undefined ? adminData.vcRoleIdPermission : [];
    const webhookUserIds = adminData && adminData.webhookUserIdPermission !== undefined ? adminData.webhookUserIdPermission : [];
    const webhookRoleIds = adminData && adminData.webhookRoleIdPermission !== undefined ? adminData.webhookRoleIdPermission : [];

    const [formAdminData, setAdminFormData] = useState<AdminFormData>({
        guild_id                    :BigInt(id || ''),
        line_permission             :adminData && adminData.linePermission !== undefined ? adminData.linePermission : 8,
        line_user_id_permission     :lineUserIds,
        line_role_id_permission     :lineRoleIds,
        line_bot_permission         :adminData && adminData.lineBotPermission !== undefined ? adminData.lineBotPermission : 8,
        line_bot_user_id_permission :lineBotUserIds,
        line_bot_role_id_permission :lineBotRoleIds,
        vc_permission               :adminData && adminData.vcPermission !== undefined ? adminData.vcPermission : 8,
        vc_user_id_permission       :vcUserIds,
        vc_role_id_permission       :vcRoleIds,
        webhook_permission          :adminData && adminData.webhookPermission !== undefined ? adminData.webhookPermission : 8,
        webhook_user_id_permission  :webhookUserIds,
        webhook_role_id_permission  :webhookRoleIds
    });

    const SERVER_BASE_URL = process.env.REACT_APP_SERVER_URL

    const userIdSelect = UserIdComprehension(guildMember);
    //const [lineUserIdSelected,setLineUserIdSelected] = useState(UserIdIndexComprehension(lineUserIds,guildMember));
    const lineUserIdSelected = UserIdIndexComprehension(lineUserIds,guildMember);
    const lineBotUserIdSelected = UserIdIndexComprehension(lineBotUserIds,guildMember);
    const vcUserIdSelected = UserIdIndexComprehension(vcUserIds,guildMember);
    const webhookUserIdSelected = UserIdIndexComprehension(webhookUserIds,guildMember);

    const roleIdSelect = RoleIdComprehension(guildRole);
    const lineRoleIdSelected = RoleIdIndexComprehension(lineRoleIds,guildRole);
    const lineBotRoleIdSelected = RoleIdIndexComprehension(lineBotRoleIds,guildRole);
    const vcRoleIdSelected = RoleIdIndexComprehension(vcRoleIds,guildRole);
    const webhookRoleIdSelected = RoleIdIndexComprehension(webhookRoleIds,guildRole);

    const handleFormSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        selectedLineUserValue.map((user,index) => {
            formAdminData.line_user_id_permission.push(user.value);
        });
        selectedLineRoleValue.map((role,index) => {
            formAdminData.line_role_id_permission.push(role.value);
        });
        selectedLineBotUserValue.map((user,index) => {
            formAdminData.line_bot_user_id_permission.push(user.value);
        });
        selectedLineBotRoleValue.map((role,index) => {
            formAdminData.line_bot_role_id_permission.push(role.value);
        });
        selectedVcUserValue.map((user,index) => {
            formAdminData.vc_user_id_permission.push(user.value);
        });
        selectedVcRoleValue.map((role,index) => {
            formAdminData.vc_role_id_permission.push(role.value);
        });
        selectedWebhookUserValue.map((user,index) => {
            formAdminData.webhook_user_id_permission.push(user.value);
        });
        selectedWebhookRoleValue.map((role,index) => {
            formAdminData.webhook_role_id_permission.push(role.value);
        });
        const jsonData = JSON.stringify(formAdminData,(key, value) => {
            if (typeof value === 'bigint') {
                console.log(value);
                console.log(value.toString());
                return value.toString();
            }
            return value;
        });
        console.log(jsonData)
        const adminJson = await axios.post(
            `${SERVER_BASE_URL}/api/admin-success-json`,
            JSON.parse(jsonData),
            { withCredentials: true }
        );
    };

    const [selectedLineUserValue, setselectedLineUserValue] = useState(lineUserIdSelected);
    const [selectedLineBotUserValue, setselectedLineBotUserValue] = useState(lineBotUserIdSelected);
    const [selectedVcUserValue, setselectedVcUserValue] = useState(vcUserIdSelected);
    const [selectedWebhookUserValue, setselectedWebhookUserValue] = useState(webhookUserIdSelected);

    const [selectedLineRoleValue, setselectedLineRoleValue] = useState(lineRoleIdSelected);
    const [selectedLineBotRoleValue, setselectedLineBotRoleValue] = useState(lineBotRoleIdSelected);
    const [selectedVcRoleValue, setselectedVcRoleValue] = useState(vcRoleIdSelected);
    const [selectedWebhookRoleValue, setselectedWebhookRoleValue] = useState(webhookRoleIdSelected);

    useEffect(() => {
        let ignore = false;
        async function fetchData() {
            try {
                const response = await axios.get<DiscordAdmin>(
                    `${SERVER_BASE_URL}/guild/${id}/admin/view`,
                    { withCredentials: true }
                );
                const responseData = response.data;
                console.log(responseData);
                setAdminData(responseData);
                setIsLoading(false); // データ取得完了後にローディングを解除
            } catch (error: unknown) {
                console.error('ログインに失敗しました。 -', error);
                //throw new Error('ログインに失敗しました。 - ', error);
            }
        }
        if (!ignore){
            fetchData();
        }
        return () => {
            ignore = true;
        };
    },[]);

    if (isLoading || adminData === undefined) {
        return <div>Loading...</div>;
    } else {
        console.log('line ',lineUserIdSelected);
        console.log('ids',lineUserIds);
        console.log('lineselect ',selectedLineUserValue);
        console.log(lineUserIds);
        return(
            <>
                <form onSubmit={handleFormSubmit}>
                    <details>
                        <summary>
                            <strong>LINEへの送信設定</strong>
                        </summary>
                        <div>
                            <label>編集を許可する権限コード</label>
                            <input
                                type="text"
                                name="line_permission"
                                defaultValue={formAdminData.line_permission}
                            />
                        </div>
                        <h6>アクセスを許可するメンバーの選択</h6>
                        <div style={{ width: "500px", margin: "50px" }}>
                            <Select
                                key={`input_${selectedLineUserValue.length}`}
                                options={userIdSelect}
                                defaultValue={lineUserIdSelected}
                                onChange={(value) => {
                                    value ? setselectedLineUserValue([...value]) : null;
                                }}
                                isMulti // trueに
                            />
                        </div>
                        <h6>アクセスを許可するロールの選択</h6>
                        <div style={{ width: "500px", margin: "50px" }}>
                            <Select
                                options={roleIdSelect}
                                defaultValue={selectedLineRoleValue}
                                onChange={(value) => {
                                    value ? setselectedLineRoleValue([...value]) : null;
                                }}
                                isMulti // trueに
                            />
                        </div>
                    </details>
                    <details>
                        <summary>
                            <strong>LINEBotおよびグループ設定</strong>
                        </summary>
                        <div>
                            <label>編集を許可する権限コード</label>
                            <input
                                type="text"
                                name="line_bot_permission"
                                defaultValue={formAdminData.line_bot_permission}
                            />
                        </div>
                        <h6>アクセスを許可するメンバーの選択</h6>
                        <div style={{ width: "500px", margin: "50px" }}>
                            <Select
                                options={userIdSelect}
                                defaultValue={selectedLineBotUserValue}
                                onChange={(value) => {
                                    value ? setselectedLineBotUserValue([...value]) : null;
                                }}
                                isMulti // trueに
                            />
                        </div>
                        <h6>アクセスを許可するロールの選択</h6>
                        <div style={{ width: "500px", margin: "50px" }}>
                            <Select
                                options={roleIdSelect}
                                defaultValue={selectedLineBotRoleValue}
                                onChange={(value) => {
                                    value ? setselectedLineBotRoleValue([...value]) : null;
                                }}
                                isMulti // trueに
                            />
                        </div>
                    </details>
                    <details>
                        <summary>
                            <strong>ボイスチャンネルの通知設定</strong>
                        </summary>
                        <div>
                            <label>編集を許可する権限コード</label>
                            <input
                                type="text"
                                name="vc_permission"
                                defaultValue={formAdminData.vc_permission}
                            />
                        </div>
                        <h6>アクセスを許可するメンバーの選択</h6>
                        <div style={{ width: "500px", margin: "50px" }}>
                            <Select
                                options={userIdSelect}
                                defaultValue={selectedVcUserValue}
                                onChange={(value) => {
                                    value ? setselectedVcUserValue([...value]) : null;
                                }}
                                isMulti // trueに
                            />
                        </div>
                        <h6>アクセスを許可するロールの選択</h6>
                        <div style={{ width: "500px", margin: "50px" }}>
                            <Select
                                options={roleIdSelect}
                                defaultValue={selectedVcRoleValue}
                                onChange={(value) => {
                                    value ? setselectedVcRoleValue([...value]) : null;
                                }}
                                isMulti // trueに
                            />
                        </div>
                    </details>
                    <details>
                        <summary>
                            <strong>Webhookの通知設定</strong>
                        </summary>
                        <div>
                            <label>編集を許可する権限コード</label>
                            <input
                                type="text"
                                name="webhook_permission"
                                defaultValue={formAdminData.webhook_permission}
                            />
                        </div>
                        <h6>アクセスを許可するメンバーの選択</h6>
                        <div style={{ width: "500px", margin: "50px" }}>
                            <Select
                                options={userIdSelect}
                                defaultValue={selectedWebhookUserValue}
                                onChange={(value) => {
                                    value ? setselectedWebhookUserValue([...value]) : null;
                                }}
                                isMulti // trueに
                            />
                        </div>
                        <h6>アクセスを許可するロールの選択</h6>
                        <div style={{ width: "500px", margin: "50px" }}>
                            <Select
                                options={roleIdSelect}
                                defaultValue={selectedWebhookRoleValue}
                                onChange={(value) => {
                                    value ? setselectedWebhookRoleValue([...value]) : null;
                                }}
                                isMulti // trueに
                            />
                        </div>
                    </details>
                    <button type="submit">Submit</button>
                </form>
            </>
        )
    }
}

export default Admin;