import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate, useParams} from "react-router-dom";
import './EditProduct.css'

const url = 'https://script.google.com/macros/s/AKfycbxm7V8Y9af9txfn5nJAwl42DopwuS7OFRKOIeBF_1xZ6yTQZ_DhfJKYJ6kP7hfk_1u7/exec';

const EditProductPage = ({productInfo, refresh}) => {
    const {productID} = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        image_url: '',
        status: '',
        alcoholic: '',
        // Add other form fields as needed
    });
    const product = productInfo.products.find(product => product.product_id === parseInt(productID));

    const handleChange = (e) => {
        const {name, value} = e.target;
        if (name === 'alcoholic') {
            setFormData({...formData, [name]: e.target.checked});
        } else {
            setFormData({...formData, [name]: value});
        }
    };

    const handleSubmit = async (e, action) => {
        e.preventDefault();

        try {
            let formDataToSend = {...formData};

            // If action is delete, set the status to 'delete'
            if (action === 'hidden') {
                formDataToSend.status = 'hidden';
                console.log('hidden');
            }else if (action === 'unhidden') {
                formDataToSend.status = 'available';
                console.log('unhidden');
            }
            console.log(formDataToSend);

            const response = await axios.post(
                url + '?endpoint=products/' + productID,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            if (response.status === 200) {
                if (action === 'hidden') {
                    console.log('Product hidden successfully');
                    alert(`成功隱藏商品：${product.name}`);
                }else if (action === 'unhidden') {
                    console.log('Product hidden successfully');
                    alert(`取消隱藏商品：${product.name}`);
                } else {
                    console.log('Product edited successfully');
                    alert('Product edited successfully');
                }
                refresh();
                navigate("/admin/product");

            } else {
                console.error('Failed to perform action:', response.statusText);
                alert('Failed to perform action');
            }
        } catch (error) {
            console.error('Error performing action:', error);
            alert('Error performing action');
        }
    };


    return (
        <div className="bg-banner">
            <p className="titleText">編輯商品</p>
            {productInfo.loading ? ( // Show loading indicator if loading is true
                <p>Loading...</p>
            ) : (
                <div className="edit-form">
                    <form onSubmit={handleSubmit}>
                        <div className="edit-field">
                            <label htmlFor="productName">商品名稱:</label>
                            <input
                                type="text"
                                id="productName"
                                name="name"
                                placeholder={product.name}
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="edit-field">
                            <label htmlFor="productPrice">商品價格:</label>
                            <input
                                type="number"
                                id="productPrice"
                                name="price"
                                placeholder={product.price}
                                value={formData.price}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="edit-field">
                            <label htmlFor="productStatus">商品狀態:</label>
                            <select
                                id="productStatus"
                                name="status"
                                value={formData.status !== '' ? formData.status : product.status}
                                onChange={handleChange}
                            >
                                <option value="available">Available</option>
                                <option value="hidden">Hidden</option>
                                <option value="deleted">Deleted</option>
                            </select>
                        </div>
                        <div className="edit-field">
                            <label htmlFor="productDescription">商品類別:</label>
                            <input
                                type="text"
                                id="productDescription"
                                name="description"
                                placeholder={product.description}
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="edit-field alcField">
                            <input
                                type="checkbox"
                                id="productAlcoholic"
                                name="alcoholic"
                                value={formData.alcoholic !== '' ? formData.alcoholic : product.alcoholic}
                                defaultChecked={product.alcoholic}
                                onChange={handleChange}
                            />
                            <label htmlFor="productAlcoholic" className="alcLabel">含酒精</label>
                        </div>
                        <div className='edit-buttons'>
                            <button type="submit">完成編輯</button>
                            {product.status === 'available' &&
                                ( <button onClick={(e) => handleSubmit(e, 'hidden')}>隱藏商品</button>
                            )}
                            {product.status === 'hidden' &&
                                ( <button onClick={(e) => handleSubmit(e, 'unhidden')}>取消隱藏</button>
                            )}
                        </div>
                    </form>
                </div>
            )}
        </div>

    );
};

export default EditProductPage;
