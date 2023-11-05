const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    order_id: {
        type: String,
        required: true
    },
    payment_method: {
        type: String,
        required: true,
        enum: ["Card", "Cash"]
    },
    transaction_date: {
        type: String,
        required: true
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
