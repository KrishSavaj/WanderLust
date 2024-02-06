// importing the mongoose.
const mongoose = require("mongoose"); 
// 

const schema = mongoose.Schema;

// importing the pasport-local-mogoose for hashing in password protection in our website.
const passportlocalmongoose = require("passport-local-mongoose");
// 

const userSchema = new schema({
    email:{
        type:String,
        required:true
    }
});

// it will automatically apply the hashing , salting in our username and password.. 
userSchema.plugin(passportlocalmongoose);
// 

module.exports = mongoose.model("user",userSchema);