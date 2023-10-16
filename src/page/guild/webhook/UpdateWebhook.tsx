import React, { useState, useEffect } from "react";
import Select,{ MultiValue } from "react-select";

import { DiscordWebhook,SelectOption } from '../../../store';

interface UpdateWebhookSelectionProps {
    updateUuids:string[];
    webhookSet:DiscordWebhook;
    handleUpdateWebhookChange:(
        webhookKind:SelectOption,
        uuid:string
    ) => void;
    handleUpdateWebhookRoleChange:(
        webhookRoles:MultiValue<SelectOption>,
        uuid:string
    ) => void;
    handleUpdateWebhookUserChange:(
        webhookUsers:MultiValue<SelectOption>,
        uuid:string
    ) => void;
    handleUpdateWebhookInputChange:(e: React.ChangeEvent<HTMLInputElement>) => void;
    handleUpdateWebhookInputArray:(
        inputName:string,
        uuid:string,
        popIndex?:number
    ) => void;
    handleDeleteWebhookCheckboxChange:(
        uuid:string,
        checkState:boolean
    ) => void;
}

const UpdateWebhookSelection:React.FC<UpdateWebhookSelectionProps> = ({
    updateUuids,
    webhookSet,
    handleUpdateWebhookChange,
    handleUpdateWebhookRoleChange,
    handleUpdateWebhookUserChange,
    handleUpdateWebhookInputChange,
    handleUpdateWebhookInputArray,
    handleDeleteWebhookCheckboxChange
}) => {
    const webhookSelects = webhookSet.webhooks.map((webhook) => ({  //webhookのselectの選択肢を作成
        value:webhook.id,
        label:`${webhook.channelName}:${webhook.name}`
    }));
    const webhookRoles = webhookSet.guildRoles.map((role) => ({     //roleのselectの選択肢を作成
        value:role.id,
        label:role.name
    }));
    const webhookUsers = webhookSet.guildUsers.map((user) => ({     //userのselectの選択肢を作成
        value:user.id,
        label:`${user.userDisplayName}:${user.name}`
    }))

    const updateWebhook = webhookSet.webhookSet.filter((updateWebhook) => { //更新するwebhookのみを抽出
        if (updateUuids.includes(updateWebhook.uuid)){
            return updateWebhook
        }
    })

    function WebhookRoleIdIndexComprehension(
        roleIdList:string[],
        roleList:{
            id:string,
            name:string
        }[]
    ){
        /*
        すでに選択されているロールを抜き取る
        */
        let optionDict: SelectOption;
        let optionList: SelectOption[] = [];
        roleList.forEach(role => {
            if (roleIdList.includes(role.id)){
                optionDict = {
                    value:role.id,
                    label:role.name
                }
                optionList.push(optionDict)
            }
        })
        //console.log(roleIdList,roleList)
        //console.log(optionList)
        return optionList
    }

    //console.log(webhookSet.guildRoles)

    return(
        <details>
            <summary>
                <strong>更新</strong>
            </summary>
            <ul>
                {updateWebhook.map((updateWebhook) => (
                    <details key={updateWebhook.uuid}>
                        <summary>
                            <strong>{updateWebhook.subscription_type}:{updateWebhook.subscription_id}</strong>
                        </summary>
                        <ul>
                            <label>削除</label>
                            <input
                                type="checkbox"
                                onChange={(e) => handleDeleteWebhookCheckboxChange(
                                    updateWebhook.uuid,
                                    e.target.checked
                                )}
                                {...webhookSet.chengePermission ? {} : {disabled:true}}
                            ></input>
                            <h6>WebHook</h6>
                            <Select
                                className="select-bar"
                                options={webhookSelects}
                                defaultValue={webhookSelects.filter((webhookSelect) => webhookSelect.value === updateWebhook.webhook_id)[0]}
                                onChange={(value) => {
                                    if(value){
                                        handleUpdateWebhookChange(
                                            value,
                                            updateWebhook.uuid
                                        )
                                    }
                                }}
                                {...webhookSet.chengePermission ? {} : {isDisabled:true}}
                            ></Select>

                            <h6>サブスクリプションタイプ(例:twitter,niconico)</h6>
                            <input
                                type="text"
                                id={`subscType${updateWebhook.uuid}`}
                                onChange={handleUpdateWebhookInputChange}
                                defaultValue={updateWebhook.subscription_type}
                                {...webhookSet.chengePermission ? {} : {disabled:true}}
                            />

                            <h6>サブスクリプションid(例:twitter:@ユーザ名(@は含まない),niconico:/user/userId)</h6>
                            <input
                                type="text"
                                id={`subscId${updateWebhook.uuid}`}
                                onChange={handleUpdateWebhookInputChange}
                                defaultValue={updateWebhook.subscription_id}
                                {...webhookSet.chengePermission ? {} : {disabled:true}}
                            />

                            <h6>メンションするロールの選択</h6>
                            <Select
                                className="select-bar"
                                options={webhookRoles}
                                defaultValue={WebhookRoleIdIndexComprehension(
                                    updateWebhook.mention_roles,
                                    webhookSet.guildRoles
                                )}
                                onChange={(value) => {
                                    if(value){
                                        handleUpdateWebhookRoleChange(
                                            [...value],
                                            updateWebhook.uuid
                                        )
                                    }
                                }}
                                isMulti // trueに
                                {...webhookSet.chengePermission ? {} : {isDisabled:true}}
                            ></Select>

                            <h6>メンションするメンバーの選択</h6>
                            <Select
                                className="select-bar"
                                options={webhookUsers}
                                defaultValue={updateWebhook.mention_members.map((member) => (
                                    {
                                        value:member,
                                        label:webhookSet.guildUsers.filter((guildUser) => guildUser.id === member)[0].name
                                    }
                                ))}
                                onChange={(value) => {
                                    if(value){
                                        handleUpdateWebhookUserChange(
                                            [...value],
                                            updateWebhook.uuid
                                        )
                                    }
                                }}
                                isMulti // trueに
                                {...webhookSet.chengePermission ? {} : {isDisabled:true}}
                            ></Select>

                            <h3>ワードカスタム(niconicoには反映されません)</h3>
                            <h6>キーワードOR検索(いずれかの言葉が含まれている場合、送信)</h6>
                            {updateWebhook.search_or_word.map((sOrWord,index) => (
                                <div key={`${index}`}>
                                    <label>検索条件:{index + 1}</label>
                                    <InputForm
                                        textName="searchOrWord"
                                        uuid={updateWebhook.uuid}
                                        index={index}
                                        valueWord={sOrWord}
                                        chengePermission={webhookSet.chengePermission}
                                        handleUpdateWebhookInputChange={handleUpdateWebhookInputChange}
                                        handleUpdateWebhookInputArray={handleUpdateWebhookInputArray}
                                    ></InputForm>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => handleUpdateWebhookInputArray(
                                    "searchOrWord",
                                    updateWebhook.uuid
                                )}
                                {...webhookSet.chengePermission ? {} : {disabled:true}}
                            >条件追加</button>

                            <h6>キーワードAND検索(すべての単語が含まれている場合、送信)</h6>
                            {updateWebhook.search_and_word.map((sAndWord,index) => (
                                <div key={`${index}`}>
                                    <label>検索条件:{index + 1}</label>
                                    <InputForm
                                        textName="searchAndWord"
                                        uuid={updateWebhook.uuid}
                                        index={index}
                                        valueWord={sAndWord}
                                        chengePermission={webhookSet.chengePermission}
                                        handleUpdateWebhookInputChange={handleUpdateWebhookInputChange}
                                        handleUpdateWebhookInputArray={handleUpdateWebhookInputArray}
                                    ></InputForm>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => handleUpdateWebhookInputArray(
                                    "searchAndWord",
                                    updateWebhook.uuid
                                )}
                                {...webhookSet.chengePermission ? {} : {disabled:true}}
                            >条件追加</button>

                            <h6>NGワードOR検索(いずれかの言葉が含まれている場合、送信しない)</h6>
                            {updateWebhook.ng_or_word.map((nOrWord,index) => (
                                <div key={`${index}`}>
                                    <label>検索条件:{index + 1}</label>
                                    <InputForm
                                        textName="ngOrWord"
                                        uuid={updateWebhook.uuid}
                                        index={index}
                                        valueWord={nOrWord}
                                        chengePermission={webhookSet.chengePermission}
                                        handleUpdateWebhookInputChange={handleUpdateWebhookInputChange}
                                        handleUpdateWebhookInputArray={handleUpdateWebhookInputArray}
                                    ></InputForm>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => handleUpdateWebhookInputArray(
                                    "ngOrWord",
                                    updateWebhook.uuid
                                )}
                                {...webhookSet.chengePermission ? {} : {disabled:true}}
                            >条件追加</button>

                            <h6>NGワードAND検索(すべての単語が含まれている場合、送信しない)</h6>
                            {updateWebhook.ng_and_word.map((nAndWord,index) => (
                                <div key={`${index}`}>
                                    <label>検索条件:{index + 1}</label>
                                    <InputForm
                                        textName="ngAndWord"
                                        uuid={updateWebhook.uuid}
                                        index={index}
                                        valueWord={nAndWord}
                                        chengePermission={webhookSet.chengePermission}
                                        handleUpdateWebhookInputChange={handleUpdateWebhookInputChange}
                                        handleUpdateWebhookInputArray={handleUpdateWebhookInputArray}
                                    ></InputForm>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => handleUpdateWebhookInputArray(
                                    "ngAndWord",
                                    updateWebhook.uuid
                                )}
                                {...webhookSet.chengePermission ? {} : {disabled:true}}
                            >条件追加</button>

                            <h6>メンションOR検索(いずれかの言葉が含まれている場合、メンションを付けて送信)</h6>
                            {updateWebhook.mention_or_word.map((mOrWord,index) => (
                                <div key={`${index}`}>
                                    <label>検索条件:{index + 1}</label>
                                    <InputForm
                                        textName="mentionOrWord"
                                        uuid={updateWebhook.uuid}
                                        index={index}
                                        valueWord={mOrWord}
                                        chengePermission={webhookSet.chengePermission}
                                        handleUpdateWebhookInputChange={handleUpdateWebhookInputChange}
                                        handleUpdateWebhookInputArray={handleUpdateWebhookInputArray}
                                    ></InputForm>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => handleUpdateWebhookInputArray(
                                    "mentionOrWord",
                                    updateWebhook.uuid
                                )}
                                {...webhookSet.chengePermission ? {} : {disabled:true}}
                            >条件追加</button>

                            <h6>メンションAND検索(すべての単語が含まれている場合、メンションを付けて送信)</h6>
                            {updateWebhook.mention_and_word.map((mAndWord,index) => (
                                <div key={`${index}`}>
                                    <label>検索条件:{index + 1}</label>
                                    <InputForm
                                        textName="mentionAndWord"
                                        uuid={updateWebhook.uuid}
                                        index={index}
                                        valueWord={mAndWord}
                                        chengePermission={webhookSet.chengePermission}
                                        handleUpdateWebhookInputChange={handleUpdateWebhookInputChange}
                                        handleUpdateWebhookInputArray={handleUpdateWebhookInputArray}
                                    ></InputForm>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => handleUpdateWebhookInputArray(
                                    "mentionAndWord",
                                    updateWebhook.uuid
                                )}
                                {...webhookSet.chengePermission ? {} : {disabled:true}}
                            >条件追加</button>
                        </ul>
                    </details>
                ))}
            </ul>
        </details>
    );
}

export default UpdateWebhookSelection;

const InputForm: React.FC<{
    textName:string,
    uuid:string,
    index:number,
    valueWord:string,
    chengePermission:boolean,
    handleUpdateWebhookInputChange:(e: React.ChangeEvent<HTMLInputElement>) => void,
    handleUpdateWebhookInputArray:(
        inputName:string,
        uuid:string,
        popIndex?:number
    ) => void
}> = ({
    textName,
    uuid,
    index,
    valueWord,
    chengePermission,
    handleUpdateWebhookInputChange,
    handleUpdateWebhookInputArray
}) => {
    return (
        <>
            <input
                id={`${textName}${uuid}`}
                name={`${index}`}
                type="text"
                value={valueWord}
                onChange={handleUpdateWebhookInputChange}
                {...chengePermission ? {} : {disabled:true}}
            ></input>
            <button
                type="button"
                onClick={() => handleUpdateWebhookInputArray(
                    textName,
                    uuid,
                    index
                )}
                {...chengePermission ? {} : {disabled:true}}
            >条件削除</button>
        </>
    )
}