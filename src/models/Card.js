const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    card_number: {
        type: String,
        required: [true, 'A card must have a card number'],
        validate: {
            validator: function(value) {
                return /^\d{16}$/.test(value);
            },
            message: 'Card number must be a 16-digit number',
        },
    },
    expiry_date: {
        type: Date,
        required: [true, 'A card must have an expiry date'],
        validate: {
            validator: function(value) {
                return value > new Date();
            },
            message: 'Expiry date must be in the future',
        },
    },
    cvv: {
        type: String,
        required: [true, 'A card must have a CVV'],
        validate: {
            validator: function(value) {
                return /^\d{3,4}$/.test(value);
            },
            message: 'CVV must be a 3 or 4-digit number',
        },
    },
});

module.exports = cardSchema;
