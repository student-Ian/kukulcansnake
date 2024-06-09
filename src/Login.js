import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './auth';
import axios from 'axios';
import './Login.css';

const url = 'https://script.google.com/macros/s/AKfycbxm7V8Y9af9txfn5nJAwl42DopwuS7OFRKOIeBF_1xZ6yTQZ_DhfJKYJ6kP7hfk_1u7/exec';

export const Login = () => {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const redirectPath = location.state?.path || '/admin';

    const handleLogin = async(e, acc, pwd) => {
        if (user === "" || password === "") {
            alert("請輸入帳號密碼");
            return;
        }

        e.target.innerHTML = "登入中...";
        e.target.disabled = true;

        try {
            const response = await axios.get(url + "?endpoint=passwords/" + acc + "/" + pwd);
            if (response.data === false) {
                throw new Error("帳號或密碼錯誤");
            }
        } catch (error) {
            alert("帳號或密碼錯誤");
            e.target.innerHTML = "登入";
            e.target.disabled = false;
            return;
        }

        auth.login(user);
        navigate(redirectPath, { replace: true });
    };

    return (
        <div>
            <div className="loginBox">
                <p style={{margin: "0 auto 25px auto", fontWeight: "bold"}}>管理員登入</p>
                <input
                    type="text"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    className="userName"
                    placeholder='帳號'
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="userPwd"
                    placeholder='密碼'
                />
                <div onClick={(e) => handleLogin(e, user, password)} className='loginBtn'>登入</div>
            </div>
        </div>
    );
}
