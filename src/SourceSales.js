import React from 'react';
import axios from 'axios';
import {useState, useEffect} from 'react';
import './SourceSales.css';

const url = 'https://script.google.com/macros/s/AKfycbxm7V8Y9af9txfn5nJAwl42DopwuS7OFRKOIeBF_1xZ6yTQZ_DhfJKYJ6kP7hfk_1u7/exec';

const SourceSales = () => {
    const [statistics, setStatistics] = useState({"yjs": ["-", "-"], "tls": ["-", "-"], "syy": ["-", "-"], "mlx": ["-", "-"], "yys": ["-", "-"], "xme": ["-", "-"]});
    const friday = new Date().getDay() === 5 || new Date().getDay() === 6
                   ? new Date().getDate() - (new Date().getDay() + 2) + 7
                   : new Date().getDate() - (new Date().getDay() + 2);
    const fridayDate = new Date(new Date().setDate(friday));
    const currentMonth = fridayDate.getMonth() + 1;
    const currentWeek = Math.ceil(fridayDate.getDate() / 7);

    const fetchSourceStatistics = async () => {
        console.log("fetching source statistics...")
        try {
            const response = await axios.get(url + "?endpoint=source-statistics");
            return response.data;
        } catch (error) {
            console.error('Error fetching source statistics:', error);
            return [];
        }
    };

    useEffect(() => {
        (async () => {
            const stats = await fetchSourceStatistics();
            setStatistics(stats);
        })();
    }, []);

    if (statistics.yjs[0] === "-") {
        return (
            <div className='bg-banner'>
                <p className='titleText'>管道銷售</p>
                <div className='loadingBox'>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }


    return (
        <div className='bg-banner'>
            <p className='titleText'>管道銷售</p>
            <div className='tableBox'>
                <table>
                    <thead>
                        <tr>
                            <th colSpan={7}>{currentMonth}月份第{currentWeek}週管道銷售統計</th>
                        </tr>
                        <tr>
                            <th>管道</th>
                            <th>無酒精布丁個數</th>
                            <th>含酒精布丁個數</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>厭世醫檢師</td>
                            <td>{statistics.yjs[0]}</td>
                            <td>{statistics.yjs[1]}</td>
                        </tr>
                        <tr>
                            <td>聽力師小真</td>
                            <td>{statistics.tls[0]}</td>
                            <td>{statistics.tls[1]}</td>
                        </tr>
                        <tr>
                            <td>時遊宇</td>
                            <td>{statistics.syy[0]}</td>
                            <td>{statistics.syy[1]}</td>
                        </tr>
                        <tr>
                            <td>蔓蘿夏</td>
                            <td>{statistics.mlx[0]}</td>
                            <td>{statistics.mlx[1]}</td>
                        </tr>
                        <tr>
                            <td>雲依姍</td>
                            <td>{statistics.yys[0]}</td>
                            <td>{statistics.yys[1]}</td>
                        </tr>
                        <tr>
                            <td>小米兒</td>
                            <td>{statistics.xme[0]}</td>
                            <td>{statistics.xme[1]}</td>
                        </tr>
                        <tr>
                            <td>宇治波</td>
                            <td>{statistics.yzb[0]}</td>
                            <td>{statistics.yzb[1]}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className='emptyBox'></div>
        </div>
    );
};

export default SourceSales;