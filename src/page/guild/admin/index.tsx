import React, { useState, useEffect, useMemo } from "react";
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

import LineAdminForm from "./LineAdminForm";

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

    const userIdSelect = useMemo(() => {
        return UserIdComprehension(guildMember);    // サーバーメンバー一覧
    }, [guildMember]);
    const lineUserIdSelected = UserIdIndexComprehension(lineUserIds,guildMember);   // lineの送信設定を許可されているユーザid一覧
    const lineBotUserIdSelected = UserIdIndexComprehension(lineBotUserIds,guildMember); // linebotの設定を許可されているユーザ一覧
    const vcUserIdSelected = UserIdIndexComprehension(vcUserIds,guildMember);           // ボイスチャンネルの入退室設定を許可されているユーザ一覧
    const webhookUserIdSelected = UserIdIndexComprehension(webhookUserIds,guildMember); // webhookの設定を許可されているユーザ一覧

    const roleIdSelect = useMemo(() => {
        return RoleIdComprehension(guildRole); // サーバーロール一覧
    }, [guildRole]);
    const lineRoleIdSelected = RoleIdIndexComprehension(lineRoleIds,guildRole); // lineの送信設定を許可されているロールid一覧
    const lineBotRoleIdSelected = RoleIdIndexComprehension(lineBotRoleIds,guildRole);   // linebotの設定を許可されているロール一覧
    const vcRoleIdSelected = RoleIdIndexComprehension(vcRoleIds,guildRole);             // ボイスチャンネルの入退室設定を許可されているロール一覧
    const webhookRoleIdSelected = RoleIdIndexComprehension(webhookRoleIds,guildRole);   // webhookの設定を許可されているロール一覧

    const handleFormSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        // 各要素をselectから抜き取る
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
        // json文字列に変換(guild_id)はstrに変換
        const jsonData = JSON.stringify(formAdminData,(key, value) => {
            if (typeof value === 'bigint') {
                return value.toString();
            }
            return value;
        });
        // サーバー側に送信
        const adminJson = await axios.post(
            `${SERVER_BASE_URL}/api/admin-success-json`,
            JSON.parse(jsonData),
            { withCredentials: true }
        );
    };

    // すでに設定されている要素を設定
    const [selectedLineUserValue, setSelectedLineUserValue] = useState(lineUserIdSelected);
    const [selectedLineBotUserValue, setSelectedLineBotUserValue] = useState(lineBotUserIdSelected);
    const [selectedVcUserValue, setSelectedVcUserValue] = useState(vcUserIdSelected);
    const [selectedWebhookUserValue, setSelectedWebhookUserValue] = useState(webhookUserIdSelected);

    const [selectedLineRoleValue, setSelectedLineRoleValue] = useState(lineRoleIdSelected);
    const [selectedLineBotRoleValue, setSelectedLineBotRoleValue] = useState(lineBotRoleIdSelected);
    const [selectedVcRoleValue, setSelectedVcRoleValue] = useState(vcRoleIdSelected);
    const [selectedWebhookRoleValue, setSelectedWebhookRoleValue] = useState(webhookRoleIdSelected);

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
            setSelectedLineUserValue(lineUserIdSelected);
            setSelectedLineBotUserValue(lineBotUserIdSelected);
            setSelectedVcUserValue(vcUserIdSelected);
            setSelectedWebhookUserValue(webhookUserIdSelected);

            setSelectedLineRoleValue(lineRoleIdSelected);
            setSelectedLineBotRoleValue(lineBotRoleIdSelected);
            setSelectedVcRoleValue(vcRoleIdSelected);
            setSelectedWebhookRoleValue(webhookRoleIdSelected);
            // 追加したためローディング解除
            setIsStateing(false);
        }
    }

    if (isLoading) {
        return <div>Loading...</div>;
    } else {
        const lineUserIds = adminData && adminData.lineUserIdPermission !== undefined ? adminData.lineUserIdPermission : [];
        const lineRoleIds = adminData && adminData.lineRoleIdPermission !== undefined ? adminData.lineRoleIdPermission : [];
        const lineBotUserIds = adminData && adminData.lineBotUserIdPermission !== undefined ? adminData.lineBotUserIdPermission : [];
        const lineBotRoleIds = adminData && adminData.lineBotRoleIdPermission !== undefined ? adminData.lineBotRoleIdPermission : [];
        const vcUserIds = adminData && adminData.vcUserIdPermission !== undefined ? adminData.vcUserIdPermission : [];
        const vcRoleIds = adminData && adminData.vcRoleIdPermission !== undefined ? adminData.vcRoleIdPermission : [];
        const webhookUserIds = adminData && adminData.webhookUserIdPermission !== undefined ? adminData.webhookUserIdPermission : [];
        const webhookRoleIds = adminData && adminData.webhookRoleIdPermission !== undefined ? adminData.webhookRoleIdPermission : [];
        return(
            <>
                <form onSubmit={handleFormSubmit}>
                    <LineAdminForm
                        line_permission={formAdminData.line_permission}
                        guildMember={userIdSelect}
                        guildRole={roleIdSelect}
                        lineUserIds={lineUserIds}
                        lineRoleIds={lineRoleIds}
                    ></LineAdminForm>
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
                                defaultValue={lineBotUserIdSelected}
                                onChange={(value) => {
                                    value ? setSelectedLineBotUserValue([...value]) : null;
                                }}
                                isMulti // trueに
                            />
                        </div>
                        <h6>アクセスを許可するロールの選択</h6>
                        <div style={{ width: "500px", margin: "50px" }}>
                            <Select
                                options={roleIdSelect}
                                defaultValue={lineBotRoleIdSelected}
                                onChange={(value) => {
                                    value ? setSelectedLineBotRoleValue([...value]) : null;
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
                                defaultValue={vcUserIdSelected}
                                onChange={(value) => {
                                    value ? setSelectedVcUserValue([...value]) : null;
                                }}
                                isMulti // trueに
                            />
                        </div>
                        <h6>アクセスを許可するロールの選択</h6>
                        <div style={{ width: "500px", margin: "50px" }}>
                            <Select
                                options={roleIdSelect}
                                defaultValue={vcRoleIdSelected}
                                onChange={(value) => {
                                    value ? setSelectedVcRoleValue([...value]) : null;
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
                                defaultValue={webhookUserIdSelected}
                                onChange={(value) => {
                                    value ? setSelectedWebhookUserValue([...value]) : null;
                                }}
                                isMulti // trueに
                            />
                        </div>
                        <h6>アクセスを許可するロールの選択</h6>
                        <div style={{ width: "500px", margin: "50px" }}>
                            <Select
                                options={roleIdSelect}
                                defaultValue={webhookRoleIdSelected}
                                onChange={(value) => {
                                    value ? setSelectedWebhookRoleValue([...value]) : null;
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