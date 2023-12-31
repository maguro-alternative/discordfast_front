import React from "react";

interface BoxCheckFormProps {
    tagId:string;
    channelBool:boolean;
    channelId:string;
    categoryChannelId:string;
    labelText:string;
    chengePermission:boolean;
    checkBoxCallback:(e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BoxCheck: React.FC<BoxCheckFormProps> = ({
    tagId,
    channelBool,
    channelId,
    categoryChannelId,
    labelText,
    chengePermission,
    checkBoxCallback
}) => {
    /*
    チェックボックスのフォーム
    すでにチェックが入っているかどうかも判断する

    tagId:チェックボックスのid
    channelBool:チェックボックスの初期値
    channelId:チェックボックスのname
    categoryChannelId:チェックボックスのvalue
    labelText:チェックボックスのラベル
    checkBoxCallback:チェックボックスのコールバック関数
    */
    return(
        <>
            {channelBool ?
            <input
                type="checkbox"
                id={tagId}
                name={channelId}
                value={categoryChannelId}
                defaultChecked
                onChange={checkBoxCallback}
                {...chengePermission ? {} : {disabled:true}}
            />
            :
            <input
                type="checkbox"
                id={tagId}
                name={channelId}
                value={categoryChannelId}
                onChange={checkBoxCallback}
                {...chengePermission ? {} : {disabled:true}}
            />
            }
            <label>{labelText}</label>
        </>
    )
}

export default BoxCheck;