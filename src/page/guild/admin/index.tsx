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
    const webhookUserIdSelect = UserIdIndexComprehension(
        webhookUserIds,
        guildMember
    );

    const roleIdSelect = RoleIdComprehension(guildRole);
    const lineRoleIDSelected = RoleIdIndexComprehension(
        lineRoleIds,
        guildRole
    );
    const lineBotRoleIDSelected = RoleIdIndexComprehension(
        lineBotRoleIds,
        guildRole
    );
    const vcRoleIDSelected = RoleIdIndexComprehension(
        vcRoleIds,
        guildRole
    );
    const webhookRoleIDSelected = RoleIdIndexComprehension(
        webhookRoleIds,
        guildRole
    );

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const jsonData = JSON.stringify(formAdminData);
        console.log(jsonData);
    };

    const [selectedLineUserValue, setselectedLineUserValue] = useState(lineUserIdSelected);

    return(
        <>
            <form onSubmit={handleFormSubmit}>
                <div>
                    <label htmlFor="linePerCode">LINEへの送信設定</label>
                    <input
                        type="text"
                        name="line_permission"
                        value={formAdminData.line_permission}
                    />
                </div>
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
            </form>
        </>
    )
}

export default Admin;