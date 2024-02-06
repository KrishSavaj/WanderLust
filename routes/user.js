const express = require("express");
const router = express.Router();

// it is utility fuction which is use in out system.
const wrapAsync = require("../utils/wrapAsync");
// 

// for using the fuctionality of hashing we have to require this passport.
const passport = require("passport");
// 

// this is middleware is use for user convineces for pathing.it is mainly use for when user redirect to login and after login where user to redirect it is store in this middleware.
const { saveRedirectUrl } = require("../middleware.js");
// 

const userController = require("../controllers/users.js");

router  
    .route("/signup")
        .get(userController.renderSignupForm)
        .post(wrapAsync(userController.registerUser));

router
    .route("/login")
        .get(userController.renderLoginForm)
        .post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.login);


// for logout.
router.get("/logout",userController.logout);
// 

module.exports = router;
