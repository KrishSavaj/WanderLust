const { response } = require("express");
const Listing = require("../models/listing");

// importing the geocoding sdk from the github for good maping
const mbxGeocoding = require ('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding ({accessToken: mapToken});
// 

module.exports.index = async (req,res) => {
    const alllistings = await Listing.find({});
    res.render("./listings/index.ejs",{alllistings});
};

module.exports.renderNewForm = (req,res) => {
    res.render("./listings/new.ejs");
};

module.exports.showListing = async (req,res) => {
    let {id} = req.params;
    let list = await Listing.findById(id).populate({path: "review",populate:{path:"author"},}).populate("owner");
    if(!list){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    // console.log(list.owner);
    res.render("./listings/show.ejs",{list});
}; 

module.exports.createListing = async (req,res,next) => {
    // this is use for converting the location into the coordinates by using the sdl.
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location, 
        limit: 1,
    })
    .send(); 
    // 

    let url = req.file.path;
    let filename = req.file.filename;

    const listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    listing.image = {url,filename};
    listing.geometry = response.body.features[0].geometry;
    let newlist = await listing.save();
    req.flash("success","New Lisitng is Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req,res) => {
    let {id} = req.params;
    let list = (id,await Listing.findById(id));
    if(!list){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }

    let originalImageUrl = list.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_250");

    res.render("./listings/edit.ejs",{list,originalImageUrl});
};

module.exports.editListing =  async (req,res) => {
    let {id} = req.params;

    let lisitng = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    // this is for the uploading the image to the cloud.
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;

        lisitng.image = {url,filename};

        await lisitng.save();
    }

    req.flash("success","Listing is Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing is Deleted!");
    res.redirect("/listings");
};
