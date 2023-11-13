const mongoose = require('mongoose');
const reviewSchema = require('./Review');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
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
    price: {
        type: Number,
        required: true
    },
    stock_amount: {
        type: Number,
        required: true
    },
    reviews: {
        type: [reviewSchema],
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
    const feedbackCount = this.reviews.length;
    if (feedbackCount > 0) {
        const totalRating = this.reviews.reduce((total, feedback) => total + feedback.rating, 0);
        this.overall_rating = totalRating / feedbackCount;
    }
    next();
});

module.exports = productSchema;