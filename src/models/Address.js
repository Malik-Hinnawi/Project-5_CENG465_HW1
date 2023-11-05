const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    address_name: {
        type: String,
        required: [true, 'An address must have a name'],
        trim: true
    },
    street: {
        type: String,
        required: [true, 'An address must have a street'],
        trim: true
    },
    city: {
        type: String,
        required: [true, 'An address must have a city'],
        trim: true
    },
    state: {
        type: String,
        required: [true, 'An address must have a state'],
        trim: true
    },
    country: {
        type: String,
        required: [true, 'An address must have a country'],
        trim: true
    },
    postal_code: {
        type: Number,
        required: [true, 'An address must have a postal code']
    }
});

module.exports = addressSchema;