import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom'; // Import Link from React Router
import './OrderList.css'

const url = 'https://script.google.com/macros/s/AKfycbxm7V8Y9af9txfn5nJAwl42DopwuS7OFRKOIeBF_1xZ6yTQZ_DhfJKYJ6kP7hfk_1u7/exec';

const OrderList = ({orderInfo, orderDetailInfo, refreshOrderList}) => {
    const [filterColumn, setFilterColumn] = useState(''); // State to hold the selected column for filtering
    const [filterValue, setFilterValue] = useState('');   // State to hold the value for filtering
    const [sortKey, setSortKey] = useState(null);         // State to hold the sorting key
    const [sortOrder, setSortOrder] = useState('asc');    // State to hold the sorting order
    const [hideFinished, setHideFinished] = useState(false);    // State to hold the status of checkbox [hide finished orders

    const handleFilterColumnChange = (e) => {
        setFilterColumn(e.target.value);
    };

    const handleFilterValueChange = (e) => {
        setFilterValue(e.target.value);
    };

    const handleSort = (key) => {
        if (key === sortKey) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    const handleHideFinish = (e) => {
        setHideFinished(e.target.checked);
    }

    const handleAlert = (e) => {
        e.target.parentElement.style.opacity = 0;
        setTimeout(function(){e.target.parentElement.style.display = "none";}, 400);
    }

    const filteredOrders = orderInfo.orders.filter(order => {
        if (hideFinished) {
            if (!filterColumn)
                return order['status'] !== '已完成';
            if (!filterValue)
                return order['status'] !== '已完成';
            const columnValue = order[filterColumn];
            return columnValue && columnValue.toString().toLowerCase().includes(filterValue.toLowerCase()) && order['status'] !== '已完成';
        }
        else {
            if (!filterColumn) return true; // If no column is selected, show all orders
            if (!filterValue) return true;  // If no filter value provided, show all orders
            const columnValue = order[filterColumn];
            return columnValue && columnValue.toString().toLowerCase().includes(filterValue.toLowerCase());
        }
        });

    const sortedOrders = sortKey ? [...filteredOrders].sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];

        if (valA < valB) {
            return sortOrder === 'asc' ? -1 : 1;
        }
        if (valA > valB) {
            return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
    }) : filteredOrders;

    const handleStatusChange = async (e, order_id, currentStatus) => {
        e.preventDefault();

        try {
            let newStatus = {status: ''};
            newStatus.status = e.target.value;
            e.target.style.color = getStatusColor(newStatus.status);

            const response = await axios.post(
                url + '?endpoint=orders/' + order_id,
                newStatus,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            if (response.status === 200) {
                console.log("更改狀態成功");
                refreshOrderList();
                document.querySelector('.alert').style.display = "block";
                document.querySelector('.alert').style.opacity = 1;
            }
            else if (response.status !== 200) {
                console.error("更改狀態失敗");
                alert("更改狀態失敗");
                e.target.value = currentStatus;
                e.target.style.color = getStatusColor(currentStatus);
            }
        } catch (error) {
            console.error("更改狀態失敗");
            alert("更改狀態失敗");
            e.target.value = currentStatus;
            e.target.style.color = getStatusColor(currentStatus);
        }
    }

    const getStatusColor = (status, defaultColor = '#fffd00') => {
        switch (status.toLowerCase()) {
            case '未完成':
                return '#ff0000'; // Yellow for pending status
            case '已完成':
                return '#ff7100'; // Sky blue for processing status
            case '已出貨':
                return '#0080ff'; // Light green for completed status
            // Add more cases for other statuses as needed
            default:
                return defaultColor; // Return default color if status doesn't match any condition
        }

    };

    const personStats = {};
    orderInfo.orders.forEach((order) => {
        const orderDetails = orderDetailInfo.order_details.filter(detail => detail.order_id === order.order_id);
        const name = order.name;
        if (!personStats[name]) {
            personStats[name] = {
                count: 1,
                totalAmount: orderDetails.reduce((acc, detail) => acc + detail.subtotal, 0),
                totalQuantity: orderDetails.reduce((acc, detail) => acc + detail.quantity, 0),
            };
        } else {
            personStats[name].count += 1;
            personStats[name].totalAmount += orderDetails.reduce((acc, detail) => acc + detail.subtotal, 0);
            personStats[name].totalQuantity += orderDetails.reduce((acc, detail) => acc + detail.quantity, 0);
        }
    });

    Object.keys(personStats).forEach(name => {
        personStats[name].avgCount = personStats[name].totalQuantity / personStats[name].count;
        personStats[name].avgAmount = personStats[name].totalAmount / personStats[name].count;
    });

    console.log(personStats)

    // Get unique column names for the dropdown
    const columnNames = [
        {value: 'order_date', display: '訂單日期'},
        {value: 'name', display: '姓名'},
        {value: 'address', display: '地址'},
        {value: 'total', display: '總金額'},
        {value: 'status', display: '訂單狀態'},
    ];

    function getDisplayByValueUsingMap(value) {
        const displayValues = columnNames.map(column =>
            column.value === value ? column.display : undefined
        );
        return displayValues.find(display => display !== undefined);
    }

    const sortOrderChinese = {
        'asc': '遞增',
        'desc': '遞減'
    }

    return (
        <div className="bg-banner">
            <p className="titleText">訂單列表</p>
            <div className='alert'>
                <span className='closeBtn' onClick={handleAlert}>&times;</span>
                編輯成功！
            </div>
            <div className="order-list">
                <div className="filter-row">
                    <select value={filterColumn} onChange={handleFilterColumnChange}>
                        <option value="">過濾清單</option>
                        {columnNames.map(column => (
                            <option key={column.value} value={column.value}>{column.display}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        value={filterValue}
                        onChange={handleFilterValueChange}
                        placeholder="輸入目標"
                    />
                    <input
                        type="checkbox"
                        id="hideFinish"
                        name="hideFinish"
                        onChange={handleHideFinish}
                        value="hide"
                    />
                    <label htmlFor="hideFinish">隱藏已完成訂單</label>
                </div>
                <table className='order-table'>
                    <thead>
                    <tr>
                        <th onClick={() => handleSort('order_date')}>訂單日期</th>
                        <th onClick={() => handleSort('name')}>姓名</th>
                        <th onClick={() => handleSort('address')}>地址</th>
                        <th onClick={() => handleSort('total')}>總金額</th>
                        <th onClick={() => handleSort('status')}>訂單狀態</th>
                        {/* Add more headers as needed */}
                    </tr>
                    <tr>
                        <th colSpan={7}>排序依據： {sortKey ? `${getDisplayByValueUsingMap(sortKey)} （${sortOrderChinese[sortOrder]}）` : '預設'}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {/* {sortedOrders.map(order => (
                        <tr key={order.order_id} style={{color: getStatusColor(order.status)}}>
                            <td><Link
                                to={`/admin/order/${order.order_id}`}>{new Date(order.order_date).toLocaleString()}</Link>
                            </td>
                            <td>{order.name}</td>
                            <td>{order.address}</td>
                            <td>${order.total}</td>
                            <td>{order.status}</td>
                        </tr>
                    ))} */}
                    {sortedOrders.map(order => (
                        <tr key={order.order_id} style={{color: "#444444"}}>
                            <td><Link
                                to={`/admin/order/${order.order_id}`}>{new Date(order.order_date).toLocaleString()}</Link>
                            </td>
                            <td>{order.name}</td>
                            <td>{order.address}</td>
                            <td>${order.total}</td>
                            {/* <td style={{color: getStatusColor(order.status)}}>{order.status}</td> */}
                            <td>
                                <select
                                    name="statusSelect"
                                    defaultValue={order.status}
                                    onChange={(e) => handleStatusChange(e, order.order_id, order.status)}
                                    className="statusSelect"
                                    style={{color: getStatusColor(order.status)}}
                                >
                                    <option value="未完成" style={{color: "#ff0000"}}>未完成</option>
                                    <option value="已出貨" style={{color: "#0080ff"}}>已出貨</option>
                                    <option value="已完成" style={{color: "#ff7100"}}>已完成</option>
                                </select>
                            </td>
                            {/* Add more order details as needed */}
                        </tr>
                    ))}
                    </tbody>
                </table>
                {filterColumn === 'name' && filterValue && personStats[filterValue] && (
                    <div>
                        <h3>{filterValue}的數據:</h3>
                        <p>總訂單數: {personStats[filterValue].count}</p>
                        <p>平均個數: {personStats[filterValue].avgCount.toFixed(2)}</p>
                        <p>平均金額（不含運費）: ${personStats[filterValue].avgAmount.toFixed(2)}</p>
                    </div>
                )}
                <div className="emptyBox"></div>
            </div>
        </div>
    );
};

export default OrderList;
