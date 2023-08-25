import React from 'react';

function Index(){
    const SERVER_BASE_URL = process.env.REACT_APP_SERVER_URL
    return(
        <>
            <a href={`${SERVER_BASE_URL}/discord-login`}>Discordでログイン</a>
        </>
    )
}
export default Index;