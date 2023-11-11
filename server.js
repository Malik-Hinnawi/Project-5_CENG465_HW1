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

        // Queries for inserting information to your database.
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

        /*
            Queries
        */
        // Update and change one customer’s address,
        await Customer.findOneAndUpdate({ "first_name": "Test", "addresses.address_name": "Home" }, { $set: {"addresses.$.city": "Istanbul"} }, { new: true })
            .then(customer => console.log("Customer address updated", customer))
            .catch(err => console.log(err));

        // Update and change another customer’s password.
        await Customer.findOneAndUpdate({ "first_name": "Test" }, { password: "d4541250b586296fcce5dea4463ae17f" }, { new: true })
            .then(customer => console.log("Customer password updated", customer))
            .catch(err => console.log(err));

        //  A query should retrieve past orders.
        await Order.find()
            .then(orders => console.log("Past orders", orders))
            .catch(err => console.log(err));

        // A query should retrieve product with specific review rating.
        await Product.find({ rating: 5 })
            .then(products => console.log("Specific review rating with product", products))
            .catch(err => console.log(err));

        //  A query for deleting one product completely. 
        // (Delete the product record and then write a query to see if the product no longer exists.)
        await Product.deleteOne({ name: "Samsung Galaxy S20" })
            .then(() => console.log('Product deleted successfully'))
            .catch(err => console.log(err));

        await Product.find({ name: "Samsung Galaxy S20" })
            .then(products => console.log(products))
            .catch(err => console.log(err));

        // connection close
        mongoose.connection.close();
    })
    .catch(err => console.log("Connection error!", err));
