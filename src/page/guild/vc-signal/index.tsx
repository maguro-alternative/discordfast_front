import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { DiscordVcSignal } from '../../../store';

const VcSignal = () => {
    const { id } = useParams(); // パラメータを取得

    const [vcSignalData, setVcSignalData] = useState<DiscordVcSignal>();

    const SERVER_BASE_URL = process.env.REACT_APP_SERVER_URL
    useEffect(() => {
        let ignore = false;
        async function fetchData() {
            try {
                const response = await axios.get<DiscordVcSignal>(
                    `${SERVER_BASE_URL}/guild/${id}/vc-signal/view`,
                    { withCredentials: true }
                );
                const responseData = response.data;
                console.log(responseData);
                setVcSignalData(responseData);
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

    return(
        <></>
    )
}

export default VcSignal;