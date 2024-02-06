const Review = require("../models/review");

const Listing = require("../models/listing");

module.exports.addReview = async(req,res) => {
    let list = await Listing.findById(req.params.id);

    let newrev = new Review(req.body.review);
    newrev.author = req.user._id;
    list.review.push(newrev);

    await newrev.save();
    await list.save();

    req.flash("success","New Review Created!");
    res.redirect(`/listings/${list._id}`);
};

module.exports.destroyReview = async (req,res) => {
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    await Review.findByIdAndDelete(reviewId); 
    
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
};