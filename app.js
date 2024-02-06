// loading the enviromental data.
if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
// 

// importing the express.
const express = require("express");
const app = express();
// 

// importing the listing schema for validation at the server side by using the package joi.
const {listingSchema,reviewSchema} = require("./schema.js");
// 

// importing the ExpressError class.
const ExpressError = require("./utils/ExpressError.js");
// 

// setting the path for the views.
const path  = require("path");
app.set("view engine", "ejs"); 
app.set("views", path.join(__dirname, "views"))
// 

// for using the static file of public folder you have to do this
app.use(express.static(path.join(__dirname,"/public")));
// 

// it is use for more templating fuctionality.
const ejsmate = require("ejs-mate");
app.engine("ejs",ejsmate);
// 

// for reading the data from the request you do this encoding.
app.use(express.urlencoded({extended:true}));
// 

// for a form to send a post request and convert that reques into put this method override package is use.
const methodoverride = require("method-override");
app.use(methodoverride("_method"));
// 

// importing the mongoose.
const mongoose = require("mongoose"); 
// 

// requiring the express-sessin for storing session details.
const session = require("express-session");
// 

// requiring the connect-flash.
const flash = require("connect-flash");
// 

// for using the password hashing and salting this needs to be required.
const passport = require("passport");
const LocalStrategy = require("passport-local");
// 

// import the userSchema.
const User = require("./models/user.js");
// 

// this below two lines is for the routes listing are store in the different directory and review also.
const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
// 

// creating connection to database.
// const mongo = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;
const MongoStore = require('connect-mongo');

main().then((res) => {
    console.log("connected to the database");
}).catch((err) => {
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrl); 
}
// 

// connect-mongo package things.
const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRERT,
    },
    touchAfter:24*3600,
});

store.on("error",() => {
    console.log("ERROR IN MONGO SESSION STORE",err);
});

// 

// selecting the sesion options.
const sessionOption = {
    store,
    secret:process.env.SECRERT,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    }
};
//

// root or home page
// app.get("/",(req,res) => {
//     res.send("hi,i am root");
// });
// 

// using this session.
app.use(session(sessionOption));
// 

// using the flash.
app.use(flash());
// 

// for configuring the passport framework in you system.
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// 

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error"); 
    res.locals.currUser = req.user;
    next();
});

app.use("/listings",listingRouter);

app.use("/listings/:id/reviews",reviewsRouter);

app.use("/",userRouter);


// for page not found error.
app.all('*',(req,res,next) => {
     next(new ExpressError(404,"Page Not Found!"));
});
// 

// error handlign middleware.
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something Went Wrong!"} = err;
    res.status(statusCode).render("./listings/error.ejs",{message});
    // res.status(statusCode).send(message);
}); 
// 

// server listening port.  
app.listen(8080,() => {
    console.log("server is listening to port 8080");
});
// 