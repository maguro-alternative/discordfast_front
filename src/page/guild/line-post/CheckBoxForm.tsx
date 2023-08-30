import React from "react";

interface BoxCheckFormProps {
    channelBool:boolean;
    channelId:string;
    categoryChannelId:string;
    labelText:string;
    checkBoxCallback:(e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BoxCheck: React.FC<BoxCheckFormProps> = ({
    channelBool,
    channelId,
    categoryChannelId,
    labelText,
    checkBoxCallback
}) => {
    return(
        <>
            {channelBool ?
            <input
                type="checkbox"
                name={channelId}
                value={categoryChannelId}
                defaultChecked
                onChange={checkBoxCallback}
            />
            :
            <input
                type="checkbox"
                name={channelId}
                value={categoryChannelId}
                onChange={checkBoxCallback}
            />
            }
            <label>{labelText}</label>
        </>
    )
}

export default BoxCheck;