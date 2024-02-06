// importing the mongoose.
const mongoose = require("mongoose"); 
// 

// importing the review.
const Review = require("./review.js");
// 

// importing the user
const user = require("./user.js");
const { string } = require("joi");
// 

const schema = mongoose.Schema;

// difining the schema.
const listeneschema = new schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        url:String,
        filename:String,
    },
    price:Number,
    location:String,
    country:String,
    review:[{
            type:schema.Types.ObjectId,
            ref:"review"
        },
    ],
    owner:{
        type: schema.Types.ObjectId,
        ref:"user"
    },
    geometry:{
        type:{
            type: String, // Don't do "{ location: { type: String } } 
            enum: ['Point'], // 'location,type' must be 'Point" 
            required: true,
        },
        coordinates:{
            type: [Number], 
            required: true,
        },
    },
});
// 

listeneschema.post("findOneAndDelete",async (listing) => {
    if(listing){
        await Review.deleteMany({_id:{$in:listing.review}});
    }
});

// creating the collection.
const Listing = mongoose.model("Listing",listeneschema);
// 

// exporting the collection so that we use in our app.js
module.exports = Listing;
// 
 