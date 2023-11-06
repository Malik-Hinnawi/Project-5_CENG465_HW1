const mongoose = require('mongoose');
const addressSchema = require("../models/Address");

const shippingSchema = new mongoose.Schema({
    customer_name: {
        type: String,
        required: [true, 'A shipping record must have a customer name'],
        trim: true,
    },
    address: {
        type: addressSchema, 
        required: [true, 'A shipping record must have an address'],
    },
    mobile: {
        type: String,
        trim: true,
    },
    postal_code: {
        type: String,
        default: '313001',
    },
    company_name: {
        type: String
    }
});

module.exports = shippingSchema;

