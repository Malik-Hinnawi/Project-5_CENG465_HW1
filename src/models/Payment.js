const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    order_id: {
        type: String,
        required: true,
        ref: 'Order'
    },
    payment_method: {
        type: String,
        required: true,
        enum: ["debit", "credit", "cash"]
    },
    transaction_date: {
        type: Date,
        required: true,
        default: Date.now
    },
    created_date: {
        type: Date,
        default: Date.now,
        required: true
    },
    modified_date: {
        type: Date,
        default: Date.now,
        required: true
    }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
