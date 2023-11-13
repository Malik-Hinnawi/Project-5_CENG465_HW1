const mongoose = require('mongoose');
const shippingSchema = require('../models/Shipping');
const productSchema = require('../models/Product')

const orderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    order_date: {
        type: Date,
        default: Date.now,
        required: true,
    },
    status: {
        type: String
    },
    shipping: {
        type: shippingSchema
    },
    products: [
       new mongoose.Schema(
        {
            product: {
                type: productSchema,
            },
            quantity: {
                type: Number,
                min: 0
            },
            price: {
                type: Number,
                min: 0
            }
        }
       )
    ],
    created_date: {
        type: Date,
        default: Date.now,
        required: true,
    },
    modified_date: {
        type: Date,
    }
});

module.exports = orderSchema;
