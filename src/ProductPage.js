import React from 'react';
import { Link, useLocation } from "react-router-dom";
import './ProductPage.css';
import editImg from "./image/edit.png"
import addImg from "./image/add.png"


const ProductsPage = ({ productInfo }) => {
    const location = useLocation();
    const { pathname } = location;


    // Filter products based on availability if not in admin path
    let filteredProducts = productInfo.products;
    if (!pathname.startsWith("/admin")) {
        filteredProducts = productInfo.products.filter(product => product.status === "available");
    }


    // Group products by description
    const groupedProducts = filteredProducts.reduce((groups, product) => {
        const group = groups[product.description] || [];
        group.push(product);
        groups[product.description] = group;
        return groups;
    }, {});


    return (
    <div className="bg-banner">
        <div className="products-page">
            <p className="titleText">商品一覽</p>
            <h1>本週出勤</h1>
            {productInfo.loading ? (
                <p>Loading...</p>
            ) : (
                <div className="products-container">
                    {Object.keys(groupedProducts).map(description => (
                        <div key={description} className="product-class-section">
                            <div className="description-column">
                                <div>{description}</div>
                            </div>
                            <div className="items-column">
                                <ul className="product-list">
                                    {groupedProducts[description].map(product => (
                                        <li key={product.product_id} className="product-item">
                                            <div>{product.name}</div>
                                            <div className='productPrice'>${product.price}</div>
                                            <div className='alcoholic'>{product.alcoholic ? "*含酒精" : ""}</div>
                                            {console.log(product)}
                                            {pathname.startsWith("/admin") && (
                                                <Link to={`/admin/product/${product.product_id}`} className="edit-product-link">
                                                    <img src={editImg} alt='編輯商品'/>
                                                </Link>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                    {pathname.startsWith("/admin") && (
                        <Link to={`/admin/product/create`} className="add-product-link"><img src={addImg} alt='新增商品'/></Link>
                    )}
                </div>
            )}
        </div>
        <div className="emptyBox"></div>
    </div>
    );
};


export default ProductsPage;

