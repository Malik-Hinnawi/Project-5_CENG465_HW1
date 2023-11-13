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
    installment_option: {
        type: String,
        enum: ["one-installment", "multiple-installments"]
    },
});

module.exports = paymentSchema;
