const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res) => {
    res.render("users/signup.ejs");
};

module.exports.registerUser = async(req,res) => {
    try{
        let {username,email,password} = req.body;
    
        const newuser = new User({email,username});
    
        const reguser = await User.register(newuser,password);

        req.login(reguser,(err) => {
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    
        // console.log(reguser);
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");  
    };
};

module.exports.renderLoginForm = (req,res)=> {
    res.render("users/login.ejs");
};

module.exports.login = async(req,res) => {
    req.flash("success","welcome back to wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next) => {
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out now!");
        res.redirect("/listings");
    })
};