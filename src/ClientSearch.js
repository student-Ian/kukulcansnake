import React, {useState} from 'react';
import OrderList from "./ClientSearchOrder";
import "./ClientSearch.css";
import userImg from "./image/user.png"
import mailImg from "./image/email.png"
import phoneImg from "./image/phone.png"

function isValidPhone(str) {
    if (str.length !== 10) return false;
    if (str[0] !== '0') return false;
    for (let i = 0; i < str.length; i++) {
        if (isNaN(parseInt(str[i]))) {
            return false;
        }
    }
    return true;
}

const SearchOrderPage = ({fetch}) => {
    const [orders, setOrders] = useState([]);
    console.log(orders);

    async function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form);

        const formJson = Object.fromEntries(formData.entries());
        let name = formJson.name;
        let phone = formJson.phone;
        let email = formJson.email;
        console.log(name, phone, email);
        if (email === "" && name === "" && phone === "") {
            alert("請輸入姓名、手機/電話號碼或電子信箱。");
            return;
        } else if (email === "" && (name === "" || phone === "")) {
            alert("請輸入姓名和手機/電話號碼。");
            return;
        } else if (email === "" && !isValidPhone(phone)) {
            alert("手機/電話號碼格式錯誤。");
            return;
        }
        const subButton = document.getElementById("submitButton");
        subButton.innerHTML = "查詢中...";
        let data = await fetch(email, phone, name);
        subButton.innerHTML = "查詢";
        if (data.length === 0) alert("查無訂單，請檢查資料是否有誤。");
        setOrders(data);
    }

    return (
            <div className="bg-banner">
            {
                orders.length <= 0 ? (
                    <div>
                        <p className="titleText">查詢訂單</p>
                        <form method="get" className="search-form" onSubmit={handleSubmit}>
                            <label className="search-bar">
                                <span className="input-icon"><img src={userImg} alt='姓名'/></span>
                                <input name="name" placeholder="姓名"/>
                            </label><br></br>
                            <label className="search-bar">
                                <span className="input-icon"><img src={phoneImg} alt='手機/電話號碼'/></span>
                                <input name="phone" placeholder="手機/電話號碼"/>
                            </label><br></br>
                            <p>會員可填</p>
                            <label className="search-bar">
                                <span className="input-icon"><img src={mailImg} alt='電子信箱'/></span>
                                <input name="email" placeholder="電子信箱"/>
                            </label><br></br>
                            <button type="submit" id="submitButton">查詢</button>
                        </form>
                    </div>
                ) : (
                    <OrderList orders={orders}/>
                )
            }
            <div className="emptyBox"></div>
        </div>
    );
};

export default SearchOrderPage;



