const express = require("express");
const router = express.Router({mergeParams:true});

const wrapAsync = require("../utils/wrapAsync.js");

const {isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

// Review of listing.
// for adding the review for particular listing.
router.post("/",isLoggedIn,wrapAsync(reviewController.addReview));
// 

// for deleting the particular review.
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));
// 

module.exports = router;