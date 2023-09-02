import React, { useState, useEffect } from "react";
import {
    DiscordLinePost,
    SelectOption,
    LineSetChannels,
    VcSignalChannels,
    CategoryChannelType
} from '../../../store';
import { CategoryChannel } from "discord.js";

interface VcChannelSelectionProps {
    discordCategoryChannel:CategoryChannelType[];
    vcChannelJson:VcSignalChannels;
    channelJson:LineSetChannels;
    roles:{id:string,name:string}[];
    activeThreads:{id:string,name:string}[];
}

const VcChannelSelection:React.FC<VcChannelSelectionProps> = ({
    discordCategoryChannel,
    vcChannelJson,
    channelJson,
    roles,
    activeThreads
}) => {
    return (
        <>
            {discordCategoryChannel.map((categoryChannel,index) => (
                <details key={categoryChannel.id}>
                    <summary>
                        <strong>{categoryChannel.name}</strong>
                    </summary>
                    <ul>
                        {vcChannelJson[discordCategoryChannel[index].id].map((vcChannel) => (
                            <details key={vcChannel.id}>
                                <summary>
                                    <strong>
                                        {vcChannel.name}
                                    </strong>
                                </summary>
                            </details>
                        ))}
                    </ul>
                </details>
            ))}
        </>
    )
}

export default VcChannelSelection;