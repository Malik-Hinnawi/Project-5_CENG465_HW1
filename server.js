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
                orders[i].shipping.customer_name = dbCustomers[i].first_name + " " + dbCustomers[i].last_name
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

            dbProducts.forEach(product => {
                product.reviews.push(...reviews.filter(review => review.product_id == product._id))
                product.save()
            })

            payments.forEach((payment, index) => {
                payment.order_id = dbOrders[index]._id
            })

            await Payment.insertMany(payments)
            console.log('Payment inserted successfully');

            // Adding to cart:
            try {
                const customer = await Customer.findOne({ first_name: "Aaliyah" });
                const product = await Product.findOne({ name: "Laptop", brand: "Dell" })
                const quantity = 2;
                const cartItem = {
                    product: product,
                    quantity: quantity
                };
                customer.cart.push(cartItem);
                customer.modified_date = new Date();
                await customer.save();

                console.log("Successfully added to cart")
            } catch (err) {
                console.log(err)
            }

            try {
                const customer = await Customer.findOne({ first_name: "Evelyn" });
                const product = await Product.findOne({ name: "Laptop", brand: "Dell" })
                const quantity = 2;
                const cartItem = {
                    product: product,
                    quantity: quantity
                };
                customer.cart.push(cartItem);
                customer.modified_date = new Date();
                await customer.save();

                console.log("Successfully added to cart")
            } catch (err) {
                console.log(err)
            }

            // Adding to previously ordered:
            try {
                const customer = await Customer.findOne({ first_name: "Aaliyah" });

                const cart = customer.cart;
                customer.cart = [];

                const order = await Order.create({
                    customerId: customer._id,
                    status: "Pending",
                    shipping: {
                        customer_name: customer.first_name + ' ' + customer.last_name,
                        address: customer.addresses[0],
                    },
                    mobile: "+9051234323",
                    company_name: "Aras Kargo",
                    products: cart.map(cartItem => ({
                        product: cartItem.product,
                        quantity: cartItem.quantity,
                        price: cartItem.product.price * cartItem.quantity,
                    })),
                });

                customer.previous_orders.push(order);

                await customer.save();
            } catch (err) {
                console.error(err);
            }

            /*
                Queries
            */

            // Update and change one customer’s address,
            await Customer.findOneAndUpdate({ "email": "Aaliyah.Brown@example.com", "addresses.address_name": "Office" }, { $set: { "addresses.$.city": "Istanbul" } }, { new: true })
                .then(customer => console.log("Customer address updated"))
                .catch(err => console.log(err));

            // Update and change another customer’s password.
            await Customer.findOneAndUpdate({ "email": "Evelyn.Brown@yahoo.com" }, { password: "d4541250b586296fcce5dea4463ae17f" }, { new: true })
                .then(customer => console.log("Customer password updated"))
                .catch(err => console.log(err));

            //  A query should retrieve past orders.
            await Order.find()
                .then(orders => console.log("Past orders", orders))
                .catch(err => console.log(err));

            // A query should retrieve product with specific review rating.
            await Product.find({ overall_rating: 5 })
                .then(products => console.log("Specific review rating with product", products))
                .catch(err => console.log(err));

            //  A query for deleting one product completely. 
            // (Delete the product record and then write a query to see if the product no longer exists.)
            await Product.deleteOne({ name: "Laptop" })
                .then(() => console.log('Product deleted successfully'))
                .catch(err => console.log(err));

            await Product.find({ name: "Laptop" })
                .then(products => console.log(products))
                .catch(err => console.log(err));




            /* 
            Index Comparison
            */

            // Product name before indexing
            console.time("product_name")
            await Product.find({ name: "External SSD" })
            console.timeEnd("product_name")

            // Product name after indexing
            await Product.createIndexes({ name: "text" })
                .then(() => console.log('Product name index created successfully'))
                .catch(err => console.log(err));

            console.time("product_name_index")
            await Product.find({ name: "External SSD" })
            console.timeEnd("product_name_index")

            // All Wishlist specific customer before indexing
            console.time("wishlist")
            await Customer.find({ "email": "Evelyn.Brown@yahoo.com" }, { wishlist: 1 })
            console.timeEnd("wishlist")

            // Wishlist after indexing
            await Customer.createIndexes({ wishlist: 1 })
                .then(() => console.log('Wishlist index created successfully'))
                .catch(err => console.log(err));

            console.time("wishlist_index")
            await Customer.find({ "email": "Evelyn.Brown@yahoo.com" }, { wishlist: 1 })
            console.timeEnd("wishlist_index")

            // order_dates before indexing
            console.time("order_dates")
            await Order.find({})
            console.timeEnd("order_dates")

            // order_date after indexing
            await Order.createIndexes({ order_date: 1 })
                .then(() => console.log('Order date index created successfully'))
                .catch(err => console.log(err));


            console.time("order_dates_index")
            await Order.find({})
            console.timeEnd("order_dates_index")

            console.time("price")
            await Product.find({ price: 699 })
            console.timeEnd("price")


            await Product.createIndexes({ price: 1 })
                .then(() => console.log('price index created successfully'))
                .catch(err => console.log(err));

            console.time("price_index")
            await Product.find({ price: 699 })
            console.timeEnd("price_index")

            mongoose.connection.close();
        } catch (error) {
            console.error('Error:', error);
        }
    })
    .catch(err => console.log("Connection error!", err));
