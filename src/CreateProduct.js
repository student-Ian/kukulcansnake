import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import './CreateProduct.css'

const url = 'https://script.google.com/macros/s/AKfycbxm7V8Y9af9txfn5nJAwl42DopwuS7OFRKOIeBF_1xZ6yTQZ_DhfJKYJ6kP7hfk_1u7/exec';

const AddProductPage = ({refresh}) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        image_url: '',
        alcoholic: false,
        // Add other form fields as needed
    });


    const handleChange = (e) => {
        const {name, value} = e.target;
        if (name === 'alcoholic') {
            setFormData({...formData, [name]: e.target.checked});
        } else {
            setFormData({...formData, [name]: value});
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Send a POST request to the Google Apps Script endpoint
            console.log(JSON.stringify(formData));
            const response = await axios.post(
                url + '?endpoint=products',
                formData,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            // Handle the response
            if (response.status === 200) {
                console.log('Product added successfully');
                alert('Successfully adding product');
                refresh();
                navigate("/admin/product");

            } else {
                console.error('Failed to add product:', response.statusText);
                // Handle the error (e.g., show an error message to the user)
                alert('Failed to add product');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            // Handle the error (e.g., show an error message to the user)
            alert('Error adding product');
        }
    };


    return (
        <div className="bg-banner">
            <p className="titleText">新增商品</p>
            <div className="edit-form">
                <form onSubmit={handleSubmit}>
                    <div className="edit-field">
                        <label htmlFor="productName">商品名稱：</label>
                        <input
                            type="text"
                            id="productName"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="edit-field">
                        <label htmlFor="productPrice">商品價格：</label>
                        <input
                            type="number"
                            id="productPrice"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="edit-field">
                        <label htmlFor="productDescription">商品類別：</label>
                        <input
                            type="text"
                            id="productDescription"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="edit-field alcField">
                        <input
                            type="checkbox"
                            id="productAlcoholic"
                            name="alcoholic"
                            value={formData.alcoholic}
                            onChange={handleChange}
                        />
                        <label htmlFor="productAlcoholic" className="alcLabel">含酒精</label>
                    </div>
                    <div className='edit-buttons'>
                        <button type="submit">新增商品</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductPage;
