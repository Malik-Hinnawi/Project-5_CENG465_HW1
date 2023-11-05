const mongoose = require('mongoose');
const shippingSchema = require('../models/Shipping');
const cardSchema = require("../models/Card");

const orderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    order_date: {
        type: Date,
        default: Date.now,
        required: true
    },
    status: {
        type: String
    },
    shipping: {
        type: shippingSchema
    },
    products: {
        type: [{
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                min: 0
            },
            price: {
                type: Number,
                min: 0
            }
        }]
    },
    total_price: {
        type: Number,
        default: 0,
    },
    order_type: {
        type: String,
        enum: ["one-installment", "multiple-installments"] 
    },
    created_date: {
        type: Date,
        default: Date.now,
        required: true,
    },
    modified_date: {
        type: Date,
        default: Date.now,
        required: true,
    }
});

orderSchema.pre('save', function (next) {
    this.total_price = this.products.reduce((total, product) => total + (product.price || 0), 0);
    next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
