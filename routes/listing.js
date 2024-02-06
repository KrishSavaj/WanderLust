const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");

// importing the cloudconfig.
const {storage} = require("../cloudConfig.js");
// 

// this is use for uploading the image from the form.
const multer = require("multer");
const upload = multer({storage});
// 

// importing the middlwares from the file middleware.
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
// 

const listingController = require("../controllers/listings.js");

router
    .route("/")
        .get(wrapAsync(listingController.index))
        .post(isLoggedIn,upload.single('listing[image]'),wrapAsync(listingController.createListing));
        
// creating and adding new lists in to the database from the website.
router.get("/new",isLoggedIn,listingController.renderNewForm);

router
    .route("/:id")
        .get(wrapAsync(listingController.showListing))
        .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.editListing))
        .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


// for editing the particular lisitngs.
router.get(("/:id/edit"),isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

module.exports = router;