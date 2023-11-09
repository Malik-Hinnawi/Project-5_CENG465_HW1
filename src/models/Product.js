const mongoose = require('mongoose');
const feedbackSchema = require("./Feedback");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    brand: {
        type: String,
    },
    photo_id: {
        type: Number,
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock_amount: {
        type: Number,
        required: true
    },
    feedbacks: {
        type: [feedbackSchema],
        default: [],
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    modified_date: {
        type: Date,
    },
    overall_rating: {
        type: Number,
        default: 0,
    }
});


productSchema.pre('save', function (next) {
    const feedbackCount = this.feedbacks.length;
    if (feedbackCount > 0) {
        const totalRating = this.feedbacks.reduce((total, feedback) => total + feedback.rating, 0);
        this.overall_rating = totalRating / feedbackCount;
    }
    next();
});

module.exports = productSchema;