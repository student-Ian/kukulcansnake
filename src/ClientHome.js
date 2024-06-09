import React from 'react';
import './ClientHome.css';


const ClientHome = () => {
    return (
        <div className="wrapper">
            <div className='banner homeBox'>
                <img src={require("./image/pudding2.jpg")} alt="homePageImg" className="homeImg"/>
                <div className="title">
                    <h1>嘶內嗑私廚手工甜品</h1>
                    <p>每一口都是用心蒸煮的味道</p>
                </div>
            </div>
            <div className="banner yellowBg">
                <a href="/order" className="button">立即訂購</a>
            </div>
            <div className="emptyBox whiteBg"></div>
            <div className="banner introBox grayBg">
                <div className="textBox">
                    <h1>用好料，編織味蕾上的歌謠</h1>
                    <p>每一個布丁 都是經過慢火蒸煮</p>
                    <p>口感綿密 不會太甜</p>
                    <p>焦糖的香氣滲入布丁的底部</p>
                    <p>一口一口越吃越香</p>
                </div>
                <img src={require("./image/pudding1.png")} alt="introImg" className="introImg"/>
            </div>
            <div className="emptyBox whiteBg"></div>
            <div className="banner menuBox whiteBg">
                <img src={require("./image/menu1.jpg")} alt="menuImg1" className="menuImg"/>
            </div>
            <div className="banner menuBox whiteBg">
                <img src={require("./image/menu2.jpg")} alt="menuImg2" className="menuImg"/>
            </div>
            <div className="banner grayBg">
                <p>下完訂單記得告訴蛇蛇歐:D</p>
            </div>
            <div className="emptyBox whiteBg"></div>
        </div>
    );
};

export default ClientHome;
