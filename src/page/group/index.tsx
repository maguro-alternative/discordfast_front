import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { LineGroup } from '../../store';

const LineGroupSetting = () => {
    const { id } = useParams(); // パラメータを取得

    const [lineGroupData, setLineGroupData] = useState<LineGroup>();

    const SERVER_BASE_URL = process.env.REACT_APP_SERVER_URL
    useEffect(() => {
        let ignore = false;
        async function fetchData() {
            try {
                const response = await axios.get<LineGroup>(
                    `${SERVER_BASE_URL}/group/${id}/line-group/view`,
                    { withCredentials: true }
                );
                const responseData = response.data;
                console.log(responseData);
                setLineGroupData(responseData);
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

export default LineGroupSetting;