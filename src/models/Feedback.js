const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    customer_name: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    created_date: {
        type: Date,
        required: true
    },
    created_time: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    }
});

module.exports = feedbackSchema;