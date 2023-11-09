const mongoose = require('mongoose');

const timeValidator = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

const reviewSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    customer_name: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    time: {
        type: String,
        required: true,
        validate: {
            validator:  (value) => timeValidator.test(value),
            message: 'Invalid time format. Please use HH:MM in 24-hour format (e.g., "14:30").'
        }
    }
});

module.exports = reviewSchema;
