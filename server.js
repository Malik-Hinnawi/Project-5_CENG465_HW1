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


const username = 'admin';
const password = 'Z72Y6sWH75FTecax';
const databaseName = 'ecommerce';

const uri = `mongodb+srv://${username}:${password}@e-commercedb.02scqma.mongodb.net/${databaseName}?retryWrites=true&w=majority`;

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

        try {

            // Insert customers into the database
            await Customer.insertMany(customers);
            console.log('Customers inserted successfully');

            // Insert products into the database
            await Product.insertMany(products);
            console.log('Products inserted successfully');

            // Retrieve customers and products from the database
            const dbCustomers = await Customer.find();
            const dbProducts = await Product.find();

            // Modify orders data with customer and product references
            for (let i = 0; i < dbCustomers.length; i++) {
                orders[i].customer_id = dbCustomers[i]._id;
                orders[i].shipping.name = dbCustomers[i].first_name + " " + dbCustomers[i].last_name
                orders[i].shipping.address = dbCustomers[i].addresses[0];
                orders[i].shipping.mobile = dbCustomers[i].mobile;
                orders[i].products.push({ product: dbProducts[i], quantity: 5, price: 5 * dbProducts[i].price });

                reviews[i].customer_name = dbCustomers[i].first_name + " " + dbCustomers[i].last_name
                reviews[i].product_id = dbProducts[i]._id
            }

            dbCustomers.forEach(customer => {
                customer.wishlist.push(dbProducts[Math.floor(Math.random() * 5)])
                const customer_order = orders.filter(order => order.customer_id == customer._id)
                customer.previous_orders.push(...customer_order)
                customer.save()
            })

            const dbOrders = await Order.insertMany(orders);
            console.log('Orders inserted successfully');

            await Review.insertMany(reviews)
            console.log('Review inserted successfully');

            payments.forEach((payment, index) => {
                payment.order_id = dbOrders[index]._id
            })

            await Payment.insertMany(payments)
            console.log('Payment inserted successfully');

            /*
                Queries
            */

            // Update and change one customer’s address,
            await Customer.findOneAndUpdate({ "first_name": "Test", "addresses.address_name": "Home" }, { $set: { "addresses.$.city": "Istanbul" } }, { new: true })
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


            /*
            * Index Comparison
            */

            // Product name before indexing
            console.time("product_name")
            await Product.find({ name: "Samsung Galaxy S20" })
                .then(products => console.log(products))
                .catch(err => console.log(err));
            console.timeEnd("product_name")

            // Product name after indexing
            await Product.createIndexes({ name: "text" })
                .then(() => console.log('Product name index created successfully'))
                .catch(err => console.log(err));

            console.time("product_name_index")
            await Product.find({ name: "Samsung Galaxy S20" })
                .then(products => console.log(products))
                .catch(err => console.log(err));
            console.timeEnd("product_name_index")

            // All Wishlist specific customer before indexing
            console.time("wishlist")
            await Customer.find({ "first_name": "Test" }, { wishlist: 1 })
                .then(customer => console.log(customer))
                .catch(err => console.log(err));
            console.timeEnd("wishlist")

            // Wishlist after indexing
            await Customer.createIndexes({ wishlist: 1 })
                .then(() => console.log('Wishlist index created successfully'))
                .catch(err => console.log(err));

            console.time("wishlist_index")
            await Customer.find({ "first_name": "Test" }, { wishlist: 1 })
                .then(customer => console.log(customer))
                .catch(err => console.log(err));
            console.timeEnd("wishlist_index")

            // order_dates before exact date before indexing
            console.time("order_dates")
            await Order.find({ order_date: { $gte: new Date("2020-01-01"), $lt: new Date("2020-01-02") } })
                .then(orders => console.log(orders))
                .catch(err => console.log(err));
            console.timeEnd("order_dates")

            // order_dates after exact date after indexing
            console.time("order_dates_index")
            await Order.createIndexes({ order_date: 1 })
                .then(() => console.log('Order date index created successfully'))
                .catch(err => console.log(err));
            console.timeEnd("order_dates_index")


            mongoose.connection.close();
        } catch (error) {
            console.error('Error:', error);
        }
    })
    .catch(err => console.log("Connection error!", err));
