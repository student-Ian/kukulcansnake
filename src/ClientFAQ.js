import React, {useState} from 'react';
import './ClientFAQ.css'

const FAQs = [
    {"question": "訂購商品並成功付款後，需幾天的時間才能收到商品？", "answer": "成功付款將於三日後寄件，因應物流繁忙程度而有一到三天的誤差噢。"},
    {"question": "收貨當日如何查詢貨件到達時間？", "answer": "寄件後，會獲得貨單編號，再於黑貓物流官網查詢即可。"},
    {"question": "外島的配送時間，一樣是商品寄出的隔天就可以收到了嗎？", "answer": "外島將視黑貓物流情況而定噢。"},
    {"question": "布丁在配送時會不會壞掉？", "answer": "布丁在配送過程全程有黑貓先進的冷鍊技術保護，倘若有異常情形請再拍照給我們，我們將盡快處理。"},
    {"question": "時間點可以指定在上午、下午、晚上到貨嗎？", "answer": "到貨時段請於備註欄註記，蛇蛇老闆會幫您特別備註上去，但是實際的到貨時間點，還是會依宅配公司安排的送貨路線為主。"},
    {"question": "布丁可以放幾天？", "answer": "冷藏條件完好的情況下是一週歐:D"},
]

function FAQPage() {
    // State to keep track of the active FAQ
    const [activeIndex, setActiveIndex] = useState(null);

    // Function to toggle the active FAQ
    const toggleFAQ = async (e, index) => {
        setActiveIndex(index === activeIndex ? null : index);
    };

    return (
        <div className="bg-banner">
            <p className="titleText">FAQ</p>
            {/* Iterate through FAQs and render each FAQ */}
            <div className="QApart">
                {FAQs.map((faq, index) => (
                    <div className="faq" key={index}>
                        <br />
                        <p className="faq-question" onClick={(e) => toggleFAQ(e, index)}>
                            {activeIndex === index ? `▾` : `▸`}{` Q${index + 1}: ${faq.question}`}
                        </p>
                        {/* Display the answer if this FAQ is active */}
                        {activeIndex === index && (
                            <p className="faq-ans">
                                {`A${index + 1}: ${faq.answer}`}
                            </p>
                        )}
                        <hr />
                    </div>
                ))}
            </div>
            <div className="emptyBox"></div>
        </div>
    );
}

export default FAQPage;
