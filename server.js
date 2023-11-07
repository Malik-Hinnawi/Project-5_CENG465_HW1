const mongoose = require('mongoose');
// schemas
const customerSchema = require('./src/models/Customer');
const productSchema = require('./src/models/Product');
const orderSchema = require('./src/models/Order');
const reviewSchema = require('./src/models/Review');
const paymentSchema = require('./src/models/Payment');

// list of objects
const customers = require('./data/customers.json');
const products = require('./data/products.json');
const orders = require('./data/orders.json');
const reviews = require('./data/reviews.json');
const payments = require('./data/payments.json');

const uri = "mongodb+srv://admin:<password>@e-commercedb.02scqma.mongodb.net/ecommerce?retryWrites=true&w=majority".replace(
    '<password>',
    "Z72Y6sWH75FTecax");

mongoose.connect(uri)
    .then(async () => {
        // db connection successful log
        console.log('DB connection successful')

        // create schema
        const Customer = mongoose.model('Customer', customerSchema);
        const Product = mongoose.model('Product', productSchema);
        const Order = mongoose.model('Order', orderSchema);
        const Review = mongoose.model('Review', reviewSchema);
        const Payment = mongoose.model('Payment', paymentSchema);

        // insert data
        await Customer.insertMany(customers)
            .then(() => console.log('Customers inserted successfully'))
            .catch(err => console.log(err));

        await Product.insertMany(products)
            .then(() => console.log('Products inserted successfully'))
            .catch(err => console.log(err));

        await Order.insertMany(orders)
            .then(() => console.log('Orders inserted successfully'))
            .catch(err => console.log(err));

        await Review.insertMany(reviews)
            .then(() => console.log('Reviews inserted successfully'))
            .catch(err => console.log(err));

        await Payment.insertMany(payments)
            .then(() => console.log('Payments inserted successfully'))
            .catch(err => console.log(err));

        // queries
        await Customer.find()
            .then(customers => console.log(customers))
            .catch(err => console.log(err));

        // connection close
        mongoose.connection.close();
    })
    .catch(err => console.log("Connection error!", err));
