import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import './Navigation.css';

import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth';

export function AdminNavigation() {
    const [sidebarStyle, setSidebarStyle] = useState("sidebar");
    const [pageBlurStyle, setPageBlurStyle] = useState("page-blur");
    const [sidebarSrc, setSidebarSrc] = useState(require("./image/sidebar.png"));

    const auth = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        auth.logout();
        navigate("/admin/login");
    }

    const toggleNav = () => {
        if (sidebarStyle !== "sidebar show") setSidebarStyle("sidebar show");
        else setSidebarStyle("sidebar");
        if (pageBlurStyle !== "page-blur show") setPageBlurStyle("page-blur show");
        else setPageBlurStyle("page-blur");
        if (sidebarSrc !== require("./image/close2.png")) setSidebarSrc(require("./image/close2.png"))
        else setSidebarSrc(require("./image/sidebar.png"));
    };

    const disableNav = () => {
        setSidebarStyle("sidebar");
        setPageBlurStyle("page-blur");
        setSidebarSrc(require("./image/sidebar.png"));
    };

    return (
        <div className="sidebar-wrapper">
            <div className={pageBlurStyle} onClick={disableNav}></div>
            <div className="nav-solid"></div>
            <div className="sidebar-top">
                <span className="collapse-btn" onClick={toggleNav}>
                    <img src={sidebarSrc} alt="sidebar" className="icon"/>
                </span>
                <a href="/" className="icon-link">
                    <img src={require("./image/icon.png")} alt="home" className="icon"/>
                </a>
                {
                    auth.user &&
                    <span onClick={handleLogout} style={{marginLeft: "auto"}}>
                        <img src={require("./image/logout.png")} alt="logout" className="logoutIcon"/>
                    </span>
                }
            </div>
            <nav className={sidebarStyle}>
                <ul>
                    <hr></hr>
                    <li><Link to="/admin" onClick={toggleNav}>數據分析</Link></li>
                    <hr></hr>
                    <li><Link to="/admin/product" onClick={toggleNav}>商品管理</Link></li>
                    <hr></hr>
                    <li><Link to="/admin/order" onClick={toggleNav}>訂單管理</Link></li>
                    <hr></hr>
                    <li><Link to="/source-sales" onClick={toggleNav}>管道銷售</Link></li>
                    <hr></hr>
                    <li><Link to="/admin/manual" onClick={toggleNav}>操作說明</Link></li>
                    <hr></hr>
                    {/*<li><Link to="/admin/test">Test Page</Link></li>*/}
                </ul>
            </nav>
        </div>
    );
}

export function ClientNavigation() {
    const [sidebarStyle, setSidebarStyle] = useState("sidebar");
    const [pageBlurStyle, setPageBlurStyle] = useState("page-blur");
    const [sidebarSrc, setSidebarSrc] = useState(require("./image/sidebar.png"));

    const toggleNav = () => {
        if (sidebarStyle !== "sidebar show") setSidebarStyle("sidebar show");
        else setSidebarStyle("sidebar");
        if (pageBlurStyle !== "page-blur show") setPageBlurStyle("page-blur show");
        else setPageBlurStyle("page-blur");
        if (sidebarSrc !== require("./image/close2.png")) setSidebarSrc(require("./image/close2.png"))
        else setSidebarSrc(require("./image/sidebar.png"));
    };

    const disableNav = () => {
        setSidebarStyle("sidebar");
        setPageBlurStyle("page-blur");
        setSidebarSrc(require("./image/sidebar.png"));
    };

    return (
        <div className="sidebar-wrapper">
            <div className={pageBlurStyle} onClick={disableNav}></div>
            <div className="nav-solid"></div>
            <div className="sidebar-top">
                <span className="collapse-btn" onClick={toggleNav}>
                    <img src={sidebarSrc} alt="sidebar" className="icon"/>
                </span>
                <a href="/" className="icon-link">
                    <img src={require("./image/icon.png")} alt="home" className="icon"/>
                </a>
            </div>
            <nav className={sidebarStyle}>
                <ul>
                    <hr></hr>
                    <li><Link to="/" onClick={toggleNav}>首頁</Link></li>
                    <hr></hr>
                    <li><Link to="/product" onClick={toggleNav}>商品一覽</Link></li>
                    <hr></hr>
                    <li><Link to="/order" onClick={toggleNav}>訂購商品</Link></li>
                    <hr></hr>
                    <li><Link to="/search" onClick={toggleNav}>訂單查詢</Link></li>
                    <hr></hr>
                    <li><Link to="/faq" onClick={toggleNav}>常見問題</Link></li>
                    <hr></hr>
                    {/*<li><Link to="/admin/test">Test Page</Link></li>*/}
                </ul>
            </nav>
        </div>
    );
}
