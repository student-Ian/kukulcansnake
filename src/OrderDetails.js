import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import './OrderDetail.css'

const ViewOrderPage = ({productInfo, orderInfo, orderDetailInfo}) => {
    const {orderID} = useParams();
    const [order, setOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (order === null && !orderInfo.loading) {
            setOrder(orderInfo.orders.find(order => order.order_id === parseInt(orderID)));
        }
        const filteredOrderDetails = orderDetailInfo.order_details.filter(detail => detail.order_id === parseInt(orderID));
        setOrderDetails(filteredOrderDetails);
        setLoading(orderDetailInfo.loading);
    }, [order, orderDetailInfo, orderID, orderInfo]);


    return (
        <div className="bg-banner">
            <span className="titleText">訂單詳細資訊</span>
            {loading || order === null ? ( // Show loading indicator if loading is true
                <p>Loading...</p>
            ) : (
                <div className='detailed-info'>
                    <div style={{display: "flex"}}>
                        <div className='detailed-info-names'>
                            <span>姓名</span>
                            <span>電話</span>
                            <span>地址</span>
                            <span>訂單總金額</span>
                            <span>運費</span>
                            <span>管道</span>
                            <span>配達時間</span>
                            <span>備註{order.note}</span>
                            <span>付款方式</span>
                            {order.payment === "轉帳" && <span>帳號末五碼</span>}
                        </div>
                        <div className='detailed-info-values'>
                            <span>{order.name}</span>
                            <span>{order.phone_number.slice(0, 4)}-{order.phone_number.slice(4, 7)}-{order.phone_number.slice(7, 10)}</span>
                            <span>{order.address}</span>
                            <span>{order.total}</span>
                            <span>{order.delivery_fee}</span>
                            <span>{order.source}</span>
                            <span>{order.expected_arrival_date}</span>
                            <span>{order.note}</span>
                            <span>{order.payment}</span>
                            {order.payment === "轉帳" && <span>{order.bank_account}</span>}
                        </div>
                    </div>
                    {/* Add more order details as needed */}
                    <ul className='ordered-products'>
                        <span>商品細項</span>
                        {orderDetails.map(orderDetail => {
                            // Find the product corresponding to the orderDetail's ProductID
                            const product = productInfo.products.find(product => product.product_id === orderDetail.product_id);
                            return (
                                <li key={orderDetail.order_detail_id} className='one-product'>
                                    {product ? (
                                        <>
                                        <span>{product.name}</span>
                                        <span>${orderDetail.unit_price} × {orderDetail.quantity} 入</span>
                                        <span>${orderDetail.quantity * orderDetail.unit_price}</span>
                                        </>
                                    ) : (
                                        <span>Product with ID {orderDetail.product_id} not found</span>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                    <div className="emptyBox" style={{height: "10px"}}></div>
                </div>
            )}
        </div>
    );
};

export default ViewOrderPage;
