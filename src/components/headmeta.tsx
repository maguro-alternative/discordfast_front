import React from "react";
import { Helmet } from 'react-helmet-async';

type HeadmetaProps = {
    title?:string,
    description?:string,
    orginUrl?:string,
    iconUrl?:string
}

const Headmeta = (
    headmeta:HeadmetaProps
) => {
    return (
        <Helmet>
            <title>{headmeta.title ?? 'デフォルトのタイトルです'}</title>
            <link rel="icon" href={headmeta.iconUrl ?? `/images/discord-icon.jpg`}></link>
            <meta name="description" content={headmeta.description ?? 'デフォルトの説明文です'} />
            <link rel="icon" href={headmeta.iconUrl ?? `/images/discord-icon.jpg`}></link>
            <meta property="og:url" content={headmeta.orginUrl ?? window.location.href}></meta>
            <meta property="og:type" content=" website" />
            <meta property="og:locale" content="ja_JP" />
            <meta charSet="UTF-8"></meta>

            {/*レスポンシブ対応*/}
            <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, user-scalable=yes"></meta>
        </Helmet>
    );
};

export default Headmeta;