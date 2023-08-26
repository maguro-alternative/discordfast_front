import React, { useState, useEffect } from "react";
import Select from "react-select";
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
    guild_id                    : number;
    line_permission             : number;
    line_user_id_permission     : number[];
    line_role_id_permission     : number[];
    line_bot_permission         : number;
    line_bot_user_id_permission : number[];
    line_bot_role_id_permission : number[];
    vc_permission               : number;
    vc_user_id_permission       : number[];
    vc_role_id_permission       : number[];
    webhook_permission          : number;
    webhook_user_id_permission  : number[];
    webhook_role_id_permission  : number[];
}

const Admin = () => {
    const { id } = useParams(); // パラメータを取得

    const [adminData, setAdminData] = useState<DiscordAdmin>();

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
        guild_id                    :Number(id),
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

    const userIdSelect = UserIdComprehension(guildMember);
    const lineUserIdSelected = UserIdIndexComprehension(
        lineUserIds,
        guildMember
    );
    const lineBotUserIdSelected = UserIdIndexComprehension(
        lineBotUserIds,
        guildMember
    );
    const vcUserIdSelected = UserIdIndexComprehension(
        vcUserIds,
        guildMember
    );
    const webhookUserIdSelected = UserIdIndexComprehension(
        webhookUserIds,
        guildMember
    );

    const roleIdSelect = RoleIdComprehension(guildRole);
    const lineRoleIdSelected = RoleIdIndexComprehension(
        lineRoleIds,
        guildRole
    );
    const lineBotRoleIdSelected = RoleIdIndexComprehension(
        lineBotRoleIds,
        guildRole
    );
    const vcRoleIdSelected = RoleIdIndexComprehension(
        vcRoleIds,
        guildRole
    );
    const webhookRoleIdSelected = RoleIdIndexComprehension(
        webhookRoleIds,
        guildRole
    );

    const handleFormSubmit = (e: React.FormEvent) => {
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
        const jsonData = JSON.stringify(formAdminData);
        console.log(jsonData);
    };

    const [selectedLineUserValue, setselectedLineUserValue] = useState(lineUserIdSelected);
    const [selectedLineBotUserValue, setselectedLineBotUserValue] = useState(lineBotUserIdSelected);
    const [selectedVcUserValue, setselectedVcUserValue] = useState(vcUserIdSelected);
    const [selectedWebhookUserValue, setselectedWebhookUserValue] = useState(webhookUserIdSelected);

    const [selectedLineRoleValue, setselectedLineRoleValue] = useState(lineRoleIdSelected);
    const [selectedLineBotRoleValue, setselectedLineBotRoleValue] = useState(lineBotRoleIdSelected);
    const [selectedVcRoleValue, setselectedVcRoleValue] = useState(vcRoleIdSelected);
    const [selectedWebhookRoleValue, setselectedWebhookRoleValue] = useState(webhookRoleIdSelected);

    return(
        <>
            <form onSubmit={handleFormSubmit}>
                <details>
                    <summary>
                        <strong>LINEへの送信設定</strong>
                    </summary>
                    <div>
                        <label htmlFor="linePerCode">編集を許可する権限コード</label>
                        <input
                            type="text"
                            name="line_permission"
                            value={formAdminData.line_permission}
                        />
                    </div>
                    <h6>アクセスを許可するメンバーの選択</h6>
                    <div style={{ width: "500px", margin: "50px" }}>
                        <Select
                            options={userIdSelect}
                            defaultValue={selectedLineUserValue}
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
                        <label htmlFor="lineBotPerCode">編集を許可する権限コード</label>
                        <input
                            type="text"
                            name="line_bot_permission"
                            value={formAdminData.line_bot_permission}
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
                        <label htmlFor="vcPerCode">編集を許可する権限コード</label>
                        <input
                            type="text"
                            name="vc_permission"
                            value={formAdminData.vc_permission}
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
                        <label htmlFor="webhookPerCode">編集を許可する権限コード</label>
                        <input
                            type="text"
                            name="webhook_permission"
                            value={formAdminData.webhook_permission}
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

export default Admin;