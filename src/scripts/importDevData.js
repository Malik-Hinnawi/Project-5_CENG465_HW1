const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../models/ExampleModel');
dotenv.config({path: './config.env'});

const DB = process.env.DATABASE.replace(
    '<PASSWORD>', 
    process.env.DATABASE_PASSWORD);

mongoose.connect(DB,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
.then(() => console.log('DB connection successful'));
// Read file:
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../../dev-data/data/tours-simple.json`, `utf-8`));

// Import data into DB
const importData = async()=>{
    try{
        await Tour.create(tours);
        console.log("Data Successfully Created");
    }catch(err){
        console.log(err)
    }
    process.exit();
}

// Delete all from DB
const deleteData = async()=>{
    try{
        await Tour.deleteMany();
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