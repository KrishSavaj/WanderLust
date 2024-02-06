const mongoose = require ("mongoose");
const initdt = require("./init.js");
const Listing = require("../models/listing.js");

// creating connection to database.
const mongo = "mongodb://127.0.0.1:27017/wanderlust";

main().then((res) => {
    console.log("connected to the database");
}).catch((err) => {
    console.log(err);
});

async function main(){
    await mongoose.connect(mongo); 
}
// 

const initdb = async () => {
    await Listing.deleteMany({});
    initdt.data = initdt.data.map((obj) => ({
        ...obj,
        owner: "65b7c5577cef15b3845af3fe",
    }));
    await Listing.insertMany(initdt.data);
    console.log("data was initialized");
};

initdb();