import React, {useState} from 'react';
import './OrderList.css'


const OrderList = ({orders}) => {
    const [filterColumn, setFilterColumn] = useState(''); // State to hold the selected column for filtering
    const [filterValue, setFilterValue] = useState('');   // State to hold the value for filtering
    const [sortKey, setSortKey] = useState(null);         // State to hold the sorting key
    const [sortOrder, setSortOrder] = useState('asc');    // State to hold the sorting order


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


    const filteredOrders = orders.filter(order => {
        if (!filterColumn) return true; // If no column is selected, show all orders
        if (!filterValue) return true;  // If no filter value provided, show all orders
        const columnValue = order[filterColumn];
        return columnValue && columnValue.toString().toLowerCase().includes(filterValue.toLowerCase());
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


    const getStatusColor = (status, defaultColor='#fffd00') => {
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


    // Get unique column names for the dropdown
    const columnNames = Object.keys(orders.length > 0 ? orders[0] : {});


    return (
        <div className="clientOrderSearchWrapper">
            <p className="titleText">查詢訂單</p>
            <div className="order-list">
                <h2>歷史訂單</h2>
                <table>
                    <thead>
                    <tr>
                        <th>訂單日期</th>
                        <th>姓名</th>
                        <th>地址</th>
                        <th>總金額</th>
                        <th>訂單狀態</th>
                        {/* Add more headers as needed */}
                    </tr>
                    {/* <tr>
                        <th colSpan={7}>Sort By: {sortKey ? `${sortKey} (${sortOrder})` : 'None'}</th>
                    </tr> */}
                    </thead>
                    <tbody>
                    {/* {sortedOrders.map(order => (
                        <tr key={order.order_id} style={{color: getStatusColor(order.status)}}>
                            <td>{new Date(order.order_date).toLocaleString()}</td>
                            <td>{order.name}</td>
                            <td>{order.address}</td>
                            <td>${order.total}</td>
                            <td>{order.status}</td>
                        </tr>
                    ))} */}
                    {sortedOrders.map(order => (
                        <tr key={order.order_id} style={{color: "#444444"}}>
                            <td>{new Date(order.order_date).toLocaleString()}</td>
                            <td>{order.name}</td>
                            <td>{order.address}</td>
                            <td>${order.total}</td>
                            <td style={{color: getStatusColor(order.status)}}>{order.status}</td>
                            {/* Add more order details as needed */}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


export default OrderList;



