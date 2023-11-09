const mongoose = require('mongoose');
const addressSchema = require('./Address')
const validator = require('validator');

const customerSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, 'A customer must have a first name'],
        trim: true
    },
    last_name: {
        type: String,
        required: [true, 'A customer must have a last name'],
        trim: true
    },
    email: {
        type: String,
        validate: [validator.default.isEmail, 'email entered is invlid'],
        required: [true, 'A customer must have an email'],
    },
    password:{
        type: String,
        required: [true, 'A customer must have a password'],
    },
    addresses: {
        type: [addressSchema],
        default: []
    },
    wishlist: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Product',
        default: []
    },
    previous_orders: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Order',
        default: []
    },
    cart:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Product',
        default: []
    },
    feedbacks: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Review',
        default: []
    },
    created_date: {
        type: Date,
        default: Date.now,
        required: true,
    },
    modified_date: {
        type: Date,
    }
});

module.exports = customerSchema;