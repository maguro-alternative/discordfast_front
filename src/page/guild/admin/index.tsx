import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { DiscordAdmin } from '../../../store';

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

    const [formAdminData, setAdminFormData] = useState<AdminFormData>({
        guild_id                    :Number(id),
        line_permission             :Number(adminData?.linePermission),
        line_user_id_permission     :adminData?.lineUserIdPermission || [],
        line_role_id_permission     :adminData?.lineRoleIdPermission || [],
        line_bot_permission         :Number(adminData?.lineBotPermission),
        line_bot_user_id_permission :adminData?.lineBotUserIdPermission || [],
        line_bot_role_id_permission :adminData?.lineBotRoleIdPermission || [],
        vc_permission               :Number(adminData?.vcPermission),
        vc_user_id_permission       :adminData?.vcUserIdPermission || [],
        vc_role_id_permission       :adminData?.vcRoleIdPermission || [],
        webhook_permission          :Number(adminData?.webhookPermission),
        webhook_user_id_permission  :adminData?.webhookUserIdPermission || [],
        webhook_role_id_permission  :adminData?.webhookRoleIdPermission || []
    });

    adminData?.guildMembers.map

    return(
        <></>
    )
}

export default Admin;