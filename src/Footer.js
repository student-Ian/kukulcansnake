import React from 'react';
import './Footer.css';

function Footer() {
    return (
        <footer>
            <div className="footerInfo">
                <a href="/">
                    <img src={require("./image/icon.png")} alt="logo" className="logo"/>
                </a>
                <div className="footerText">
                    <p className="links">
                        <a href="/order" className="link"> 立即訂購 </a>|
                        <a href="/product" className="link"> 布丁口味 </a>|
                        <a href="/search" className="link"> 訂單查詢 </a>|
                        <a href="/faq" className="link"> 常見問題 </a>
                    </p>
                    <p>聯絡我們：0916-800-723</p>
                    <p>地址：
                        <a href="https://www.google.com/maps/place/%E5%98%B6%E5%85%A7%E5%97%91%E5%B8%83%E4%B8%81(%E8%AB%8B%E5%8B%99%E5%BF%85%E6%89%93%E9%9B%BB%E8%A9%B1%E8%A9%A2%E5%95%8F%E6%88%96%E9%A0%90%E7%B4%84%E4%BB%A5%E5%85%8D%E6%92%B2%E7%A9%BA)/@22.5747127,120.5219352,17z/data=!3m1!4b1!4m6!3m5!1s0x346e19a4972a0ef9:0x60e803038e292010!8m2!3d22.5747127!4d120.5245101!16s%2Fg%2F11t75trqbp?entry=ttu"
                        target="_blank" rel="noopener noreferrer">
                            911屏東縣竹田鄉洲中路42-1號
                        </a>
                        </p>
                    <p>嘶內嗑私廚甜品工作室</p>
                </div>
                <div className="iconBox">
                    <a href="https://www.facebook.com/KUKULCANSNAKE/" target="_blank" rel="noopener noreferrer">
                        <img src={require("./image/fb_icon.png")} alt="fb_icon" className="icon"/>
                    </a>
                    <a href="https://www.instagram.com/kukulcansnake?igsh=OHlkanN6a3hqOWt3" target="_blank" rel="noopener noreferrer">
                        <img src={require("./image/ig_icon.png")} alt="fb_icon" className="icon"/>
                    </a>
                    <a href="https://line.me/ti/p/yMCeV3HcPw" target="_blank" rel="noopener noreferrer">
                        <img src={require("./image/line_icon.png")} alt="fb_icon" className="icon"/>
                    </a>
                    <a href="https://liff.line.me/1645278921-kWRPP32q/?accountId=351pgban" target="_blank" rel="noopener noreferrer">
                        <img src={require("./image/line_bot_icon.png")} alt="fb_icon" className="icon"/>
                    </a>
                </div>
            </div>
            <div className="rights">&copy; 嘶內嗑私廚手工甜品. All rights reserved.</div>
        </footer>
    );
}

export default Footer;
