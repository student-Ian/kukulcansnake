export const productSchema = {
    type: 'object',
    properties: {
        product_id: {type: 'number'},
        name: {type: 'string'},
        price: {type: 'number'},
        description: {type: 'string'},
        status: {type: 'string', enum: ['available', 'hidden']},
        image_url: {type: 'string'},
    },
    required: ['product_id', 'name', 'price', 'status']
};

export const orderSchema = {
    type: 'object',
    properties: {
        order_id: {type: 'number'},
        customer_id: {type: 'number'},
        order_date: {type: 'string'},
        expected_arrival_date: {type: 'string'},
        delivery_fee: {type: 'number'},
        total: {type: 'number'},
        status: {type: 'string', enum: ['pending', 'completed', 'canceled']},
        payment: {type: 'string'},
        note: {type: 'string'},
        source: {type: 'string'},
        name: {type: 'string'},
        phone_number: {type: 'string'},
        address: {type: 'string'},
    },
    required: []
};

export const orderDetailSchema = {
    type: 'object',
    properties: {
        order_detail_id: {type: 'number'},
        order_id: {type: 'number'},
        product_id: {type: 'number'},
        quantity: {type: 'number'},
        unit_price: {type: 'number'},
        subtotal: {type: 'number'},
    },
    required: ['product_id', 'name', 'price', 'status']
};