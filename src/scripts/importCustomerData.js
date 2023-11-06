const fs = require('fs');
const mongoose = require('mongoose');
const Customer = require("../models/Customer")


const DB = "mongodb+srv://admin:<password>@e-commercedb.02scqma.mongodb.net/ecommerce?retryWrites=true&w=majority".replace(
    '<password>', 
    "Z72Y6sWH75FTecax");

mongoose.connect(DB,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('DB connection successful'));
// Read file:
const customer = JSON.parse(fs.readFileSync(`${__dirname}/../../data/customers.json`, `utf-8`));

// Import data into DB
const importData = async()=>{
    try{
        await Customer.create(customer);
        console.log("Data Successfully Created");
    }catch(err){
        console.log(err)
    }
    process.exit();
}

// Delete all from DB
const deleteData = async()=>{
    try{
        await Customer.deleteMany();
        console.log("Data Successfully Deleted"); 
    }catch(err){
        console.log(err);
    }
    process.exit();
}

if(process.argv[2] === '--import'){
    importData();
} else if(process.argv[2] === '--delete'){
    deleteData();
}