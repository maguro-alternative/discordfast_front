import React, { useState, useEffect, useMemo } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { DiscordAdmin, SelectOption } from '../../../store';
import {
    MemberIdComprehension,
    RoleIdComprehension,
} from "../../../units/dictComprehension";

import LineAdminForm from "./LineAdminForm";
import LineBotAdminForm from "./LineBotAdminForm";
import VcAdminForm from "./VcAdminForm";
import WebhookAdminForm from "./WebhookAdminForm";

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
    const [isLoading, setIsLoading] = useState(true);   // ロード中かどうか
    const [isStateing, setIsStateing] = useState(true); // サーバーからデータを取得する前か

    const guildMember = adminData && adminData.guildMembers !== undefined ? adminData.guildMembers : [];
    const guildRole = adminData && adminData.guildRoles !== undefined ? adminData.guildRoles : [];

    const [formAdminData, setAdminFormData] = useState<AdminFormData>({
        guild_id                    :BigInt(id || ''),
        line_permission             :adminData && adminData.linePermission !== undefined ? adminData.linePermission : 8,
        line_user_id_permission     :[],
        line_role_id_permission     :[],
        line_bot_permission         :adminData && adminData.lineBotPermission !== undefined ? adminData.lineBotPermission : 8,
        line_bot_user_id_permission :[],
        line_bot_role_id_permission :[],
        vc_permission               :adminData && adminData.vcPermission !== undefined ? adminData.vcPermission : 8,
        vc_user_id_permission       :[],
        vc_role_id_permission       :[],
        webhook_permission          :adminData && adminData.webhookPermission !== undefined ? adminData.webhookPermission : 8,
        webhook_user_id_permission  :[],
        webhook_role_id_permission  :[]
    });

    const SERVER_BASE_URL = process.env.REACT_APP_SERVER_URL

    const userIdSelect = useMemo(() => {
        return MemberIdComprehension(guildMember);    // サーバーメンバー一覧
    }, [guildMember]);

    const roleIdSelect = useMemo(() => {
        return RoleIdComprehension(guildRole); // サーバーロール一覧
    }, [guildRole]);

    const handleFormSubmit = async(e: React.FormEvent) => {
        /*
        送信ボタンを押したときの処理
        */
        e.preventDefault();
        // json文字列に変換(guild_id)はstrに変換
        const jsonData = JSON.stringify(formAdminData,(key, value) => {
            if (typeof value === 'bigint') {
                return value.toString();
            }
            return value;
        });
        console.log(formAdminData);
        // サーバー側に送信
        const adminJson = await axios.post(
            `${SERVER_BASE_URL}/api/admin-success-json`,
            JSON.parse(jsonData),
            { withCredentials: true }
        );
    };

    useEffect(() => {
        let ignore = false;
        async function fetchData() {
            try {
                // サーバー側から必要なデータをリクエスト追加
                const response = await axios.get<DiscordAdmin>(
                    `${SERVER_BASE_URL}/guild/${id}/admin/view`,
                    { withCredentials: true }
                );
                const responseData = response.data;
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
        // クリーンアップ(2回以上実行しない)
        return () => {
            ignore = true;
        };
    },[]);

    // ロード中ではない
    if (!isLoading) {
        // 初期値が設定されてない場合(非同期処理が間に合わないため追加)
        if(isStateing){
            // 追加したためローディング解除
            setIsStateing(false);
        }
    }

    const handleLineSelectionChange = (
        selectedValues:SelectOption[],
        selectType:string
    ) => {
        /*
        LINEへの送信設定のuser、roleのidをそれぞれ格納

        selectedValues: 選択された値
        selectType: userかroleか
        */
        if (selectType === 'user'){
            formAdminData.line_user_id_permission = [];
            selectedValues.map((option,index) => {
                formAdminData.line_user_id_permission.push(option.value);
            });
        } else if (selectType === 'role') {
            formAdminData.line_role_id_permission = [];
            selectedValues.map((option,index) => {
                formAdminData.line_role_id_permission.push(option.value);
            });
        }
    };

    const handleLineBotSelectionChange = (
        selectedValues:SelectOption[],
        selectType:string
    ) => {
        /*
        LINEBotおよびグループ設定のuser、roleのidをそれぞれ格納

        selectedValues: 選択された値
        selectType: userかroleか
        */
        if (selectType === 'user'){
            formAdminData.line_bot_user_id_permission = [];
            selectedValues.map((option,index) => {
                formAdminData.line_bot_user_id_permission.push(option.value);
            });
        } else if (selectType === 'role') {
            formAdminData.line_bot_role_id_permission = [];
            selectedValues.map((option,index) => {
                formAdminData.line_bot_role_id_permission.push(option.value);
            });
        }
    };

    const handleVcSelectionChange = (
        selectedValues:SelectOption[],
        selectType:string
    ) => {
        /*
        ボイスチャンネルの通知設定のuser、roleのidをそれぞれ格納

        selectedValues: 選択された値
        selectType: userかroleか
        */
        if (selectType === 'user'){
            formAdminData.vc_user_id_permission = [];
            selectedValues.map((option,index) => {
                formAdminData.vc_user_id_permission.push(option.value);
            });
        } else if (selectType === 'role') {
            formAdminData.vc_role_id_permission = [];
            selectedValues.map((option,index) => {
                formAdminData.vc_role_id_permission.push(option.value);
            });
        }
    };

    const handleWebhookSelectionChange = (
        selectedValues:SelectOption[],
        selectType:string
    ) => {
        /*
        Webhookの通知設定のuser、roleのidをそれぞれ格納

        selectedValues: 選択された値
        selectType: userかroleか
        */
        if (selectType === 'user'){
            formAdminData.webhook_user_id_permission = [];
            selectedValues.map((option,index) => {
                formAdminData.webhook_user_id_permission.push(option.value);
            });
        } else if (selectType === 'role') {
            formAdminData.webhook_role_id_permission = [];
            selectedValues.map((option,index) => {
                formAdminData.webhook_role_id_permission.push(option.value);
            });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        /*
        textのinputの値を格納
        */
        const { name, value, type } = e.target;

        console.log(name);

        setAdminFormData((inputDate) => ({
            ...inputDate,
            [name]: value
        }))
    };

    if (isLoading) {
        return <div>Loading...</div>;
    } else {
        const lineBotPermissionCode = adminData && adminData.lineBotPermission !== undefined ? adminData.lineBotPermission : 8;
        const lineUserIds = adminData && adminData.lineUserIdPermission !== undefined ? adminData.lineUserIdPermission : [];
        const lineRoleIds = adminData && adminData.lineRoleIdPermission !== undefined ? adminData.lineRoleIdPermission : [];

        const linePermissionCode = adminData && adminData.linePermission !== undefined ? adminData.linePermission : 8;
        const lineBotUserIds = adminData && adminData.lineBotUserIdPermission !== undefined ? adminData.lineBotUserIdPermission : [];
        const lineBotRoleIds = adminData && adminData.lineBotRoleIdPermission !== undefined ? adminData.lineBotRoleIdPermission : [];

        const vcPermissionCode = adminData && adminData.vcPermission !== undefined ? adminData.vcPermission : 8;
        const vcUserIds = adminData && adminData.vcUserIdPermission !== undefined ? adminData.vcUserIdPermission : [];
        const vcRoleIds = adminData && adminData.vcRoleIdPermission !== undefined ? adminData.vcRoleIdPermission : [];

        const webhookPermissionCode = adminData && adminData.webhookPermission !== undefined ? adminData.webhookPermission : 8;
        const webhookUserIds = adminData && adminData.webhookUserIdPermission !== undefined ? adminData.webhookUserIdPermission : [];
        const webhookRoleIds = adminData && adminData.webhookRoleIdPermission !== undefined ? adminData.webhookRoleIdPermission : [];
        return(
            <>
                <form onSubmit={handleFormSubmit}>
                    <LineAdminForm
                        linePermission={linePermissionCode}
                        guildMember={userIdSelect}
                        guildRole={roleIdSelect}
                        lineUserIds={lineUserIds}
                        lineRoleIds={lineRoleIds}
                        selectCallback={handleLineSelectionChange}
                        textCallback={handleInputChange}
                    ></LineAdminForm>
                    <LineBotAdminForm
                        lineBotPermission={lineBotPermissionCode}
                        guildMember={userIdSelect}
                        guildRole={roleIdSelect}
                        lineBotUserIds={lineBotUserIds}
                        lineBotRoleIds={lineBotRoleIds}
                        selectCallback={handleLineBotSelectionChange}
                        textCallback={handleInputChange}
                    ></LineBotAdminForm>
                    <VcAdminForm
                        vcPermission={vcPermissionCode}
                        guildMember={userIdSelect}
                        guildRole={roleIdSelect}
                        vcUserIds={vcUserIds}
                        vcRoleIds={vcRoleIds}
                        selectCallback={handleVcSelectionChange}
                        textCallback={handleInputChange}
                    ></VcAdminForm>
                    <WebhookAdminForm
                        webhookPermission={webhookPermissionCode}
                        guildMember={userIdSelect}
                        guildRole={roleIdSelect}
                        webhookUserIds={webhookUserIds}
                        webhookRoleIds={webhookRoleIds}
                        selectCallback={handleWebhookSelectionChange}
                        textCallback={handleInputChange}
                    ></WebhookAdminForm>
                    <button type="submit">Submit</button>
                </form>
            </>
        )
    }
}

export default Admin;