// importing the mongoose.
const mongoose = require("mongoose"); 
// 

const schema = mongoose.Schema;

const reviewSchema = new schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    Created_at:{
        type:Date,
        default:Date.now()
    },
    author:{
        type:schema.Types.ObjectId,
        ref:"user"
    }
});

module.exports = mongoose.model("review",reviewSchema);