const mongoose = require('mongoose');
const addressSchema = require('./Address')
const cardSchema = require("./Card")
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
    address: {
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
    saved_cards:{
        type: [cardSchema]
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
        default: Date.now,
        required: true,
    }
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;