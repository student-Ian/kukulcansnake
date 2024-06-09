import React, {useEffect, useState} from 'react';
import axios from "axios";
import CustomList from "./CustomList";
import './form.css'

const url = 'https://script.google.com/macros/s/AKfycbxm7V8Y9af9txfn5nJAwl42DopwuS7OFRKOIeBF_1xZ6yTQZ_DhfJKYJ6kP7hfk_1u7/exec';

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

function isValidAccount(str) {
    if (str.length !== 5) return false;
    for (let i = 0; i < str.length; i++) {
        if (isNaN(parseInt(str[i]))) {
            return false;
        }
    }
    return true;
}

function OrderForm({productInfo, fetch}) {
    const [submitted, setSubmitted] = useState(false);
    const [step, setStep] = useState(1);
    const [items, setItems] = useState([{option: '', value: 1}]);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [source, setSource] = useState('');
    const [otherSource, setOtherSource] = useState('');
    const [note, setNote] = useState('');
    const [payment, setPayment] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('不指定');
    const [orderCount, setOrderCount] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [errors, setErrors] = useState({});
    const [customerBankAccount, setCustomerBankAccount] = useState('');
    const [memberDiscount, setMemberDiscount] = useState(false);
    console.log(orderCount);

    useEffect(() => {
        if (customerPhone.length === 10) {
            const fetchOrderCount = async () => {
                console.log(customerPhone)
                try {
                    const response = await fetch(customerPhone);
                    setOrderCount(response);
                    console.log('fetched.');
                } catch (error) {
                    // Handle errors, if any
                    console.error('Error fetching order count:', error);
                }
            };
            fetchOrderCount();
        }
        const {totalQuantity, totalPrice} = items.reduce((acc, item) => {
            const correspondingObject = productInfo.products.find(product => product.name === item.option);

            if (correspondingObject && item.value >= 1) {
                acc.totalQuantity += item.value;
                acc.totalPrice += correspondingObject.price * item.value;
            }

            return acc;
        }, {totalQuantity: 0, totalPrice: 0});

        setTotalPrice(totalPrice);
        setTotalQuantity(totalQuantity)
    }, [customerPhone, items]);

    const handleSubmitOrder = async (e) => {
        e.target.innerHTML = '送出中...';
        try {
            // Prepare order data
            const orderData = items.map(item => {
                // Find the corresponding object in the other list based on item.name
                const correspondingObject = productInfo.products.find(products => products.name === item.option);

                // Check if a corresponding object was found
                if (correspondingObject) {
                    return {
                        product_id: correspondingObject.product_id,
                        quantity: item.value
                    };
                } else {
                    return null; // or handle this case as per your requirement
                }
            }).filter(order => order !== null); // Remove any null entries (optional, depends on your use case)

            const orderForm = {
                products: orderData,
                name: customerName,
                phone_number: customerPhone,
                address: customerAddress,
                source: source,
                note: note,
                payment: payment,
                expected_arrival_date: deliveryDate,
                email: customerEmail,
                bank_account: customerBankAccount,
                member_discount: memberDiscount
            }
            if(orderForm.source === '其他'){
                orderForm.source = otherSource;
            }
            console.log(JSON.stringify(orderForm));

            // Send order data to backend
            const response = await axios.post(
                url + '?endpoint=orders',
                orderForm,
                {
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                }
            );

            // Handle success response
            console.log('Order submitted successfully:', response.data);

            // Clear selected products
            setItems([{option: '', value: 1}]);
            setSubmitted(true);
        } catch (error) {
            // Handle error
            console.error('Error submitting order:', error);
            setSubmitted(true);
        }
    };

    if (submitted) {
        return (
            <div className="bg-banner">
                <p className="titleText">訂單</p>
                <div className="order-form" style={{margin: "90px 0px 0px 0px"}}>
                    <h1 className="success">訂單送出成功！</h1>
                    <p style={{margin: "18px auto"}}>如有任何其他問題，歡迎查看<a href="/faq" className="submittedPageLink">FAQ</a>或聯絡我們</p>
                    <p style={{margin: "18px auto 33px auto"}}>不想錯過優惠嗎？立即<a href="https://liff.line.me/1645278921-kWRPP32q/?accountId=351pgban" className="submittedPageLink" target="_blank" rel="noopener noreferrer">加入line bot</a>！</p>
                </div>
                <div className="emptyBox"></div>
            </div>
        );
    }

    const validateStep = (currentStep) => {
        const newErrors = {};
        switch (currentStep) {
            case 1:
                if (totalQuantity < 4) {
                    newErrors.items1 = "* 自取最少訂購數量為4個";
                    newErrors.items2 = "* 配送最少訂購數量為8個";
                }
                break;
            case 2:
                if (!customerName) newErrors.customerName = "* 姓名是必填項目";
                if (!customerPhone) newErrors.customerPhone = "* 電話是必填項目";
                else if (!isValidPhone(customerPhone)) newErrors.customerPhoneFormat = "* 電話格式錯誤";
                if (!customerAddress) newErrors.customerAddress = "* 地址是必填項目";
                if (customerAddress!== "自取" && totalQuantity < 8) {
                    newErrors.quantity1 = "* 自取最少訂購數量為4個";
                    newErrors.quantity2 = "* 配送最少訂購數量為8個";
                }
                break;
            case 3:
                if (!source) newErrors.source = "* 得知管道是必填項目";
                else if (source === '其他' && !otherSource) newErrors.otherSource = "* 請填寫其他管道";
                break;
            case 4:
                if (!payment) newErrors.payment = "* 請選擇付款方式";
                else if (payment === '轉帳' && !customerBankAccount) newErrors.customerBankAccount = "* 請填寫帳戶末五碼";
                else if (payment === '轉帳' && !isValidAccount(customerBankAccount)) newErrors.customerBankAccountFormat = "* 帳戶末五碼格式錯誤";
                break;
            default:
                break;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleMemberDiscount = (e) => {
        setMemberDiscount(e.target.checked);
    }

    function calculateFee() {
        let fee = 0;
        if (customerAddress.includes("竹田鄉") ||
            customerAddress.includes("屏東市") ||
            customerAddress.includes("潮州鎮") ||
            customerAddress.includes("萬丹鄉") ||
            customerAddress.includes("自取")){
            fee = "地區免運";
        }
        else {
            if (totalQuantity === 0) {
                fee = 0;
            } else if (totalQuantity <= 10) {
                fee = 160;
            } else if (totalQuantity <= 40) {
                fee = 225;
            } else if (totalQuantity <= 80) {
                fee = 290;
            } else {
                fee = 290 + 65 * ((totalQuantity - 80) / 10 + 1);
            }

            if (totalQuantity >= 48) {
                fee = 0;
            }
        }
        // -1 means is member and used free of fee over last month
        // -2 means it has not yes used it
        // if (orderCount === -2 && customerEmail.length > 0) {
        //     fee = "會員免運";
        // }
        if (orderCount === -2 && memberDiscount) {
            fee = "會員免運";
        }

        return fee
    }

    function Form({step}) {
        const nextStep = () => {
            if (validateStep(step)) {
                setStep(prevStep => prevStep + 1);
                window.scrollTo({top: 200, behavior: 'smooth'});
            }
        };
        const lastStep = () => {
            setStep(prevStep => prevStep - 1);
            window.scrollTo({top: 200, behavior: 'smooth'});
        };

        switch (step) {
            case 1:
                return (
                    <div>
                        <div>
                            <ul style={{margin: "16px 0px 31px 0px"}}>
                                <div className="ruleTitle">
                                    <h1>注意事項</h1>
                                </div>
                                <li className="rules">自取最少訂購數量為4個</li>
                                <li className="rules">配送最少訂購數量為8個</li>
                                <li className="rules">不同口味可混搭</li>
                                <li className="rules">每10個為一箱，不足一箱以一箱計</li>
                                <li className="rules">一箱運費$160，二~四箱運費$225，五箱運費$290</li>
                                <li className="rules">消費滿48個布丁免運費</li>
                                <li className="rules">欲自取請在地址欄中填入「自取」</li>
                                <li className="rules">近三個月內訂購滿三筆布丁，每筆皆超過8個，即可加入會員，每月可享一次免運！</li>
                                <li className="rules">部分商品（標有星號）含有酒精，選購時請注意</li>
                            </ul>
                            <hr className="ruleSplit"></hr>

                            <div className="orderFlow noSelect">
                                <div className="t" style={{margin: "-5px 20px 0px 0px"}}>訂單進度</div>
                                <div className="stages currentStage">1</div>
                                <div className="connect"></div>
                                <div className="stages">2</div>
                                <div className="connect"></div>
                                <div className="stages">3</div>
                                <div className="connect"></div>
                                <div className="stages">4</div>
                                <div className="connect"></div>
                                <div className="stages">5</div>
                            </div>

                            <div className="stageText">
                                <h1>選擇商品</h1>
                            </div>

                            <div className="cartWrapper">
                                <CustomList
                                    options={productInfo.products.map(product => product.name)}
                                    items={items}
                                    setItems={setItems}
                                    productInfo={productInfo}
                                />
                                <div className="cartInfoBox page1">
                                    <div className="cartInfoEntry"><p>布丁個數：</p><p>{totalQuantity}</p></div>
                                    <div className="cartInfoEntry"><p>布丁金額：</p><p>{totalPrice}</p></div>
                                    <div className="cartInfoEntry"><p>運費：</p><p>{calculateFee() === "會員免運" || calculateFee() === "地區免運" ? 0 : calculateFee()}</p></div>
                                    <hr className="cartInfoSplit"></hr>
                                    <div className="cartInfoEntry"><p>總金額：</p><p>{calculateFee() === "會員免運" || calculateFee() === "地區免運" ? totalPrice : totalPrice + calculateFee()}</p></div>
                                </div>
                            </div>
                        </div>
                        {errors.items1 && <p className="error">{errors.items1}</p>}
                        {errors.items2 && <p className="error">{errors.items2}</p>}
                        <div className="buttonBox">
                            <button onClick={nextStep}>下一步</button>
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div>
                        {/* <h1>基本資訊</h1> */}

                        <div className="orderFlow noSelect">
                            <div className="t" style={{margin: "-5px 20px 0px 0px"}}>訂單進度</div>
                            <div className="stages">1</div>
                            <div className="connect"></div>
                            <div className="stages currentStage">2</div>
                            <div className="connect"></div>
                            <div className="stages">3</div>
                            <div className="connect"></div>
                            <div className="stages">4</div>
                            <div className="connect"></div>
                            <div className="stages">5</div>
                        </div>

                        <div className="stageText">
                                <h1>基本資訊</h1>
                        </div>

                        <div className="cartWrapper">
                            <div className="customerInfoBox">
                                <div className="formEntry">
                                    <label htmlFor="customerName">姓名： </label>
                                    <input
                                        className="entryInputBox"
                                        type="text"
                                        id="customerName"
                                        name="customerName"
                                        value={customerName}
                                        onChange={e => setCustomerName(e.target.value)}
                                    />
                                </div>
                                <div className="formEntry">
                                    <label htmlFor="customerPhone">電話： </label>
                                    <input
                                        className="entryInputBox"
                                        type="text"
                                        id="customerPhone"
                                        name="customerPhone"
                                        value={customerPhone}
                                        onChange={e => setCustomerPhone(e.target.value)}
                                    />
                                </div>
                                <div className="formEntry">
                                    <label htmlFor="customerAddress">地址： </label>
                                    <input
                                        className="entryInputBox"
                                        type="text"
                                        id="customerAddress"
                                        name="customerAddress"
                                        value={customerAddress}
                                        placeholder="要自取請填入「自取」"
                                        onChange={e => setCustomerAddress(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="cartInfoBox">
                                <div className="cartInfoEntry"><p>布丁個數：</p><p>{totalQuantity}</p></div>
                                <div className="cartInfoEntry"><p>布丁金額：</p><p>{totalPrice}</p></div>
                                <div className="cartInfoEntry"><p>運費：</p><p>{calculateFee() === "會員免運" || calculateFee() === "地區免運" ? 0 : calculateFee()}</p></div>
                                <hr className="cartInfoSplit"></hr>
                                <div className="cartInfoEntry"><p>總金額：</p><p>{calculateFee() === "會員免運" || calculateFee() === "地區免運" ? totalPrice : totalPrice + calculateFee()}</p></div>
                            </div>
                        </div>
                        {errors.customerName && <p className="error">{errors.customerName}</p>}
                        {errors.customerPhone && <p className="error">{errors.customerPhone}</p>}
                        {errors.customerPhoneFormat && <p className="error">{errors.customerPhoneFormat}</p>}
                        {errors.customerAddress && <p className="error">{errors.customerAddress}</p>}
                        {errors.quantity1 && <p className="error">{errors.quantity1}</p>}
                        {errors.quantity2 && <p className="error">{errors.quantity2}</p>}
                        <div className="buttonBox">
                            <button onClick={lastStep}>上一步</button>
                            <button onClick={nextStep}>下一步</button>
                        </div>
                    </div>
                )
            case 3:
                return (
                    <div>
                        {/* <h1>額外資訊</h1> */}
                        <div className="orderFlow noSelect">
                            <div className="t">訂單進度</div>
                            <div className="stages">1</div>
                            <div className="connect"></div>
                            <div className="stages">2</div>
                            <div className="connect"></div>
                            <div className="stages currentStage">3</div>
                            <div className="connect"></div>
                            <div className="stages">4</div>
                            <div className="connect"></div>
                            <div className="stages">5</div>
                        </div>

                        <div className="stageText">
                                <h1>其他資訊</h1>
                        </div>

                        <div className="cartWrapper">
                            <div className="customerInfoBox">
                                <div className="formEntry">
                                    <label htmlFor="source">得知嘶內嗑私廚手工甜品的管道： </label>
                                    <select
                                        className="entryInputBox"
                                        type="text"
                                        id="source"
                                        name="source"
                                        value={source}
                                        onChange={e => setSource(e.target.value)}
                                    >
                                        <option value="">請選擇管道</option>
                                        <option value="厭世醫檢師">厭世醫檢師</option>
                                        <option value="聽力師小真">聽力師小真</option>
                                        <option value="時遊宇">時遊宇</option>
                                        <option value="蔓蘿夏">蔓蘿夏</option>
                                        <option value="雲依姍">雲依姍</option>
                                        <option value="小米兒">小米兒</option>
                                        <option value="被蛇蛇拐來的">被蛇蛇拐來的</option>
                                        <option value="其他">其他</option>
                                    </select>
                                </div>
                                {source === '其他' && (
                                    <div className="formEntry">
                                        <label htmlFor="otherSource">其他管道：</label>
                                        <input
                                            className="entryInputBox"
                                            type="text"
                                            id="otherSource"
                                            name="otherSource"
                                            value={otherSource}
                                            onChange={(e) => setOtherSource(e.target.value)}
                                        />
                                    </div>
                                )}
                                <div className="formEntry">
                                    <label htmlFor="note">訂單備註： </label>
                                    <textarea
                                        className="entryInputBox"
                                        type="text"
                                        id="note"
                                        name="note"
                                        value={note}
                                        onChange={e => setNote(e.target.value)}
                                    />
                                </div>
                                <div className="formEntry">
                                    <label htmlFor="deliveryDate">期望配送時間： </label>
                                    <select
                                        className="entryInputBox"
                                        id="deliveryDate"
                                        name="deliveryDate"
                                        value={deliveryDate}
                                        onChange={e => setDeliveryDate(e.target.value)}
                                    >
                                        <option value="不指定">不指定</option>
                                        <option value="13:00以前">13:00以前</option>
                                        <option value="14:00~18:00">14:00~18:00</option>
                                        {/* Add more options as needed */}
                                    </select>
                                </div>
                                {(orderCount >= 2) &&
                                    <div className="formEntry">
                                        <label htmlFor="customerEmail">輸入信箱以加入會員： </label>
                                        <input
                                            className="entryInputBox"
                                            type="text"
                                            id="customerEmail"
                                            name="customerEmail"
                                            value={customerEmail}
                                            onChange={e => setCustomerEmail(e.target.value)}
                                        />
                                    </div>
                                }
                                {(orderCount === -2) &&
                                    <div className="formEntry">
                                        <input
                                            className="entryInputBox"
                                            type="checkbox"
                                            id="memberDiscount"
                                            name="memberDiscount"
                                            value={memberDiscount}
                                            onChange={(e) => handleMemberDiscount(e)}
                                        />
                                        <label htmlFor="memberDiscount">使用會員免運</label>
                                    </div>
                                }
                            </div>

                            <div className="cartInfoBox">
                                <div className="cartInfoEntry"><p>布丁個數：</p><p>{totalQuantity}</p></div>
                                <div className="cartInfoEntry"><p>布丁金額：</p><p>{totalPrice}</p></div>
                                <div className="cartInfoEntry"><p>運費：</p><p>{calculateFee() === "會員免運" || calculateFee() === "地區免運" ? 0 : calculateFee()}</p></div>
                                <hr className="cartInfoSplit"></hr>
                                <div className="cartInfoEntry"><p>總金額：</p><p>{calculateFee() === "會員免運" || calculateFee() === "地區免運" ? totalPrice : totalPrice + calculateFee()}</p></div>
                            </div>
                        </div>
                        {errors.source && <p className="error">{errors.source}</p>}
                        {errors.otherSource && <p className="error">{errors.otherSource}</p>}
                        <div className="buttonBox">
                            <button onClick={lastStep}>上一步</button>
                            <button onClick={nextStep}>下一步</button>
                        </div>
                    </div>
                )
            case 4:
                return (
                    <div>
                        {/* <h1>付款方式</h1> */}
                        <div className="orderFlow noSelect">
                            <div className="t">訂單進度</div>
                            <div className="stages">1</div>
                            <div className="connect"></div>
                            <div className="stages">2</div>
                            <div className="connect"></div>
                            <div className="stages">3</div>
                            <div className="connect"></div>
                            <div className="stages currentStage">4</div>
                            <div className="connect"></div>
                            <div className="stages">5</div>
                        </div>

                        <div className="stageText">
                                <h1>付款方式</h1>
                        </div>

                        <div className="cartWrapper">
                            <div className="customerInfoBox">
                                <div className="formEntry">
                                    <label htmlFor="payment">付款方式： </label>
                                    <select
                                        className="entryInputBox"
                                        id="payment"
                                        name="payment"
                                        value={payment}
                                        onChange={e => setPayment(e.target.value)}
                                    >
                                        <option value="">請選擇付款方式</option>
                                        <option value="line pay">Line Pay</option>
                                        <option value="taiwan pay">台灣 Pay</option>
                                        <option value="轉帳">銀行轉帳</option>
                                    </select>
                                </div>

                                {payment === "line pay" && (
                                    <div className="lineLinkBox">
                                        <div>
                                            <img src={require("./image/qr-code.png")} alt="qr_code" className="qr_code" />
                                        </div>
                                        <div>
                                            <p style={{margin: "0px 15px 0px 5px", display: "inline"}}>或者</p>
                                            <a href="https://line.me/ti/p/yMCeV3HcPw" target="_blank"
                                            rel="noopener noreferrer">加入LINE好友</a>
                                        </div>
                                    </div>
                                )}

                                {payment === "taiwan pay" && (
                                    <div>
                                        <div className="taiwanLinkBox">
                                            <div>
                                                <img src={require("./image/taiwanPay.png")} alt="qr_code" className="qr_code" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {payment === "轉帳" && (
                                    <div>
                                        <div className="formEntry">
                                            <p>帳號: (007) 751 5050 7949</p>
                                        </div>
                                        <div className="formEntry">
                                            <label htmlFor="customerBankAccount">帳戶末五碼： </label>
                                            <input
                                                className="entryInputBox"
                                                type="text"
                                                id="customerBankAccount"
                                                name="customerBankAccount"
                                                value={customerBankAccount}
                                                onChange={e => setCustomerBankAccount(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="cartInfoBox">
                                <div className="cartInfoEntry"><p>布丁個數：</p><p>{totalQuantity}</p></div>
                                <div className="cartInfoEntry"><p>布丁金額：</p><p>{totalPrice}</p></div>
                                <div className="cartInfoEntry"><p>運費：</p><p>{calculateFee() === "會員免運" || calculateFee() === "地區免運" ? 0 : calculateFee()}</p></div>
                                <hr className="cartInfoSplit"></hr>
                                <div className="cartInfoEntry"><p>總金額：</p><p>{calculateFee() === "會員免運" || calculateFee() === "地區免運" ? totalPrice : totalPrice + calculateFee()}</p></div>
                            </div>
                        </div>
                        {errors.payment && <p className="error">{errors.payment}</p>}
                        {errors.customerBankAccount && <p className="error">{errors.customerBankAccount}</p>}
                        {errors.customerBankAccountFormat && <p className="error">{errors.customerBankAccountFormat}</p>}
                        <div className="buttonBox">
                            <button onClick={lastStep}>上一步</button>
                            <button onClick={nextStep}>下一步</button>
                            {/* {payment.length > 0 && <button onClick={handleSubmitOrder}>送出訂單</button>} */}
                        </div>
                    </div>
                )
            case 5:
                return (
                    <div>
                        <div className="orderFlow noSelect">
                            <div className="t" style={{margin: "-5px 20px 0px 0px"}}>訂單進度</div>
                            <div className="stages">1</div>
                            <div className="connect"></div>
                            <div className="stages">2</div>
                            <div className="connect"></div>
                            <div className="stages">3</div>
                            <div className="connect"></div>
                            <div className="stages">4</div>
                            <div className="connect"></div>
                            <div className="stages currentStage">5</div>
                        </div>

                        <div className="stageText">
                            <h1>訂單確認</h1>
                        </div>

                        {/* version 1 */}
                        {/* <div className="confirmBox">
                            <div className="infoConfirm">
                                <p>訂購人資料：</p>
                                <ul>
                                    <li>姓名：{customerName}</li>
                                    <li>電話：{customerPhone}</li>
                                    <li>地址：{customerAddress}</li>
                                    <li>管道：{source}</li>
                                    {source === '其他' && <p>其他管道：{otherSource}</p>}
                                    <li>備註：{note === '' ? "無" : note}</li>
                                    <li>期望配送時間：{deliveryDate}</li>
                                    <li>付款方式：{payment}</li>
                                </ul>
                            </div>
                            <hr></hr>
                            <div className="itemConfirm">
                                <p>商品明細：</p>
                                <ul>
                                    {items.map(item => {
                                        if (item.value > 0) {
                                            return (
                                                <li key={item.option}>
                                                    {item.option} × {item.value}
                                                </li>
                                            );
                                        }
                                        return null;
                                    })}
                                </ul>
                            </div>
                            <hr></hr>
                            <div className="priceConfirm">
                                <p>金額確認：</p>
                                <ul>
                                    <li>布丁金額：{totalPrice}</li>
                                    <li>運費：{calculateFee() === "會員免運" || calculateFee() === "地區免運" ? 0 : calculateFee()}</li>
                                    <li>總金額：{calculateFee() === "會員免運" || calculateFee() === "地區免運" ? totalPrice : totalPrice + calculateFee()}</li>
                                </ul>
                            </div>
                        </div> */}

                        { /* version 2 */ }
                        <div className="confirmBox2">
                            <div className="infoConfirm">
                                <p>訂購人資料：</p>
                                {/* <hr></hr> */}
                                <p className="confirmEntry">姓名：{customerName}</p>
                                <p className="confirmEntry">電話：{customerPhone}</p>
                                <p className="confirmEntry">地址：{customerAddress}</p>
                                <p className="confirmEntry">管道：{source}</p>
                                {source === '其他' && <p className="confirmEntry">其他管道：{otherSource}</p>}
                                <p className="confirmEntry">備註：{note === '' ? "無" : note}</p>
                                <p className="confirmEntry">期望配送時間：{deliveryDate}</p>
                                <p className="confirmEntry">付款方式：{payment}</p>
                                {payment === "轉帳" && <p className="confirmEntry">帳戶末五碼：{customerBankAccount}</p>}
                            </div>
                            <hr></hr>
                            <div className="itemConfirm">
                                <p>商品明細：</p>
                                {/* <hr></hr> */}
                                {items.map(item => {
                                    if (item.value > 0 && item.option !== '') {
                                        return (
                                            <p key={item.option} className="confirmEntry">
                                                {productInfo.products.find(product => product.name === item.option).alcoholic ? "*" : ""}{item.option} ── ( ${productInfo.products.find(product => product.name === item.option).price} ) × {item.value}
                                            </p>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                            <hr></hr>
                            <div className="priceConfirm">
                                <p>布丁金額：{totalPrice}</p>
                                <p>運費：{calculateFee() === "會員免運" || calculateFee() === "地區免運" ? 0 : calculateFee()}</p>
                                {/* <hr></hr> */}
                                <p>總金額：{calculateFee() === "會員免運" || calculateFee() === "地區免運" ? totalPrice : totalPrice + calculateFee()}</p>
                            </div>
                        </div>

                        <div className="buttonBox">
                            <button onClick={lastStep}>上一步</button>
                            <button onClick={e => handleSubmitOrder(e)}>送出訂單</button>
                        </div>
                    </div>
                )
            default:
                return null;
        }
    }

    return (
        <div className="bg-banner">
            <p className="titleText">訂單</p>
            <div className="order-form">
                {Form({step: step})}
            </div>
            <div className="emptyBox"></div>
        </div>
    );
}

export default OrderForm;
