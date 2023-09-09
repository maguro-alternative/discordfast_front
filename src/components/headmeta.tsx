import React, { useState, useEffect } from "react";
import axios from 'axios';

const Headmeta = (
    title:string,
    description:string,
    orginUrl:string,
    iconUrl:string
) => {
    return (
        <head>
            <title>{title}</title>
            <link rel="icon" href={iconUrl}></link>
            <meta name="description" content={description} />
            <link rel="icon" href={iconUrl}></link>
            <meta property="og:url" content={orginUrl}></meta>
            <meta property="og:type" content=" website" />
            <meta property="og:locale" content="ja_JP" />
            <meta charSet="UTF-8"></meta>

            {/*レスポンシブ対応*/}
            <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, user-scalable=yes"></meta>
        </head>
    );
};

export default Headmeta;