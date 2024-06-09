import React, {useEffect, useState} from 'react';
import axios from "axios";
import Ajv from 'ajv';

import {Routes, Route} from 'react-router-dom';
import * as schemas from './schemas';
import {ClientLayout} from "./Layout";
import ClientHome from "./ClientHome";
import ProductsPage from "./ProductPage";
import OrderForm from "./ClientOrder";
import SearchOrderPage from "./ClientSearch";
import FAQPage from "./ClientFAQ";
import SourceSales from "./SourceSales";

const url = 'https://script.google.com/macros/s/AKfycbxm7V8Y9af9txfn5nJAwl42DopwuS7OFRKOIeBF_1xZ6yTQZ_DhfJKYJ6kP7hfk_1u7/exec';


const ClientRoutes = () => {
    const [productLoading, setProductLoading] = useState(true);
    const [products, setProducts] = useState([]);


    useEffect(() => {
        if (!products.length) {
            fetchProduct();
        }
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
            const filteredProducts = validatedProducts.filter(product => product.status === "available");
            setProducts(filteredProducts);
            setProductLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setProductLoading(false);
        }
    };

    const fetchOrder = async (email = '', phone = '', name = '') => {
        console.log("fetching order data...")
        try {
            const response = await axios.get(url + "?endpoint=orders/search&email=" + email + "&name=" + name + "&phone=" + phone);
            const ajv = new Ajv();
            const validate = ajv.compile(schemas.orderSchema);
            const validatedOrders = response.data.filter(order => {
                return true;
            });
            return validatedOrders
        } catch (error) {
            console.error('Error fetching orders:', error);
            return [];
        }
    };

    const fetchCustomerNum = async (phone_number) => {
        console.log("fetching customer order num...")
        try {
            const response = await axios.get(url + "?endpoint=customers/member-available/" + phone_number);
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const productInfo = {
        loading: productLoading,
        products: products,
    }

    return (
        <Routes>
            <Route element={<ClientLayout/>}>
                <Route
                    path="/"
                    element={<ClientHome/>}
                />
                <Route
                    path="/product"
                    element={<ProductsPage productInfo={productInfo}/>}
                />
                <Route
                    path="/order"
                    element={<OrderForm productInfo={productInfo} fetch={fetchCustomerNum}/>}
                />
                <Route
                    path="/search"
                    element={<SearchOrderPage productInfo={productInfo} fetch={fetchOrder}/>}
                />
                <Route
                    path="/faq"
                    element={<FAQPage/>}
                />
                <Route
                    path="/source-sales"
                    element={<SourceSales/>}
                />
            </Route>
        </Routes>
    );
};

export default ClientRoutes;
