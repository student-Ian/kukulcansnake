import React, {useEffect, useState} from 'react';
import axios from "axios";
import Ajv from 'ajv';

import {AuthProvider} from "./auth";
import {Routes, Route, Navigate} from 'react-router-dom';
import OrderDashboard from './Dashboard';
import ProductsPage from './ProductPage';
import AddProductPage from "./CreateProduct";
import OrderList from "./OrderList";
import ViewOrderPage from "./OrderDetails";
import * as schemas from './schemas';
import {AdminLayout} from "./Layout";
import EditProductPage from "./EditProduct";
import { Login } from "./Login";
import { RequireAuth } from './RequireAuth';
import Manual from './Manual';

const url = 'https://script.google.com/macros/s/AKfycbxm7V8Y9af9txfn5nJAwl42DopwuS7OFRKOIeBF_1xZ6yTQZ_DhfJKYJ6kP7hfk_1u7/exec';

const AdminRoutes = () => {
    const [productLoading, setProductLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [orderLoading, setOrderLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [orderDetailLoading, setOrderDetailLoading] = useState(true);
    const [orderDetails, setOrderDetails] = useState([]);

    useEffect(() => {
        fetchProduct();
        fetchOrder();
        fetchOrderDetail();
    }, []);

    const fetchProduct = async () => {
        console.log("fetching product data...")
        setProductLoading(true);
        try {
            const response = await axios.get(url + "?endpoint=products");
            const ajv = new Ajv();
            const validate = ajv.compile(schemas.productSchema);
            const validatedProducts = response.data.filter(product => {
                return validate(product);
            });
            setProducts(validatedProducts);
            setProductLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setProductLoading(false);
        }
    };

    const fetchOrder = async () => {
        console.log("fetching order data...")
        setOrderLoading(true);
        try {
            const response = await axios.get(url + "?endpoint=orders");
            const ajv = new Ajv();
            const validate = ajv.compile(schemas.orderSchema);
            const validatedOrders = response.data.filter(order => {
                return true;
            });
            setOrders(validatedOrders);
            setOrderLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setOrderLoading(false);
        }
    };

    const fetchOrderDetail = async () => {
        console.log("fetching order details...")
        try {
            const response = await axios.get(url + '?endpoint=order-details');
            const ajv = new Ajv();
            const validate = ajv.compile(schemas.orderDetailSchema);
            const validatedOrderDetails = response.data.filter(order_details => {
                return true;
            });
            setOrderDetails(validatedOrderDetails);
            setOrderDetailLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setOrderDetailLoading(false);
            return null;
        }
    };

    const productInfo = {
        loading: productLoading,
        products: products,
    }

    const orderInfo = {
        loading: orderLoading,
        orders: orders,
    }

    const orderDetailsInfo = {
        loading: orderDetailLoading,
        order_details: orderDetails,
    }

    return (
        <AuthProvider>
            <Routes>
                <Route element={<AdminLayout/>}>
                    <Route
                        path="/"
                        element={<RequireAuth><OrderDashboard productInfo={productInfo} orderInfo={orderInfo} orderDetailInfo={orderDetailsInfo}/></RequireAuth>}
                    />
                    <Route
                        path="/product"
                        element={<RequireAuth><ProductsPage productInfo={productInfo}/></RequireAuth>}
                    />
                    <Route
                        path="/product/:productID"
                        element={<RequireAuth><EditProductPage productInfo={productInfo} refresh={fetchProduct}/></RequireAuth>}
                    />
                    <Route
                        path="/product/create"
                        element={<RequireAuth><AddProductPage refresh={fetchProduct}/></RequireAuth>}
                    />
                    <Route
                        path="/order"
                        element={<RequireAuth><OrderList orderInfo={orderInfo} orderDetailInfo={orderDetailsInfo} refreshOrderList={fetchOrder}/></RequireAuth>}
                    />
                    <Route
                        path="/order/:orderID"
                        element={<RequireAuth><ViewOrderPage productInfo={productInfo} orderInfo={orderInfo}
                                                orderDetailInfo={orderDetailsInfo}/></RequireAuth>}
                    />
                    <Route path="/manual" element={<RequireAuth><Manual/></RequireAuth>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="*" element={<Navigate to="/admin" replace/>}/>
                </Route>
            </Routes>
        </AuthProvider>
    );
};

export default AdminRoutes;
