const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const list = require("../models/listing");
const user = require("../models/userModel");
const { ValidList, ValidReview } = require("../schema.js");
const ExpressError = require("../utils/ExpressError");
const { isLoggedIn, saveRedirectUrl } = require("../middleware.js");
const { valiDate } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../CloudConfig.js");
const upload = multer({ storage });
const geocodeAddress = require("../public/js/cordinate.js");
const controller = require("../controllers/listing.controller.js");
//Function

const ValidateListing = (req, res, next) => {
  let { error } = ValidList.validate(req.body);
  // console.log(result);
  if (error) {
    errorMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errorMsg);
  } else {
    next();
  }
};

// ------------------ All list of property  --------------------------------------------------

router.get("/", controller.index);

// ---------------Post Request on new ------------------------------------------------

router.get("/new", isLoggedIn, controller.newListing);

//---------------- new Listing post-------------

router.post("/", upload.single("image"), ValidateListing, controller.createListing);

// ------------My listing----------------

router.get("/mylisting", isLoggedIn, controller.MyListing);

// -------------------- Perticuler property ----------------------------------------------

router.get("/:id", controller.PerticularListing);

// ----------------------- EDIT --------------------------------------------------------------

router.get("/:id/edit", isLoggedIn, controller.getedit);

// ------------------- UPDATE ----------------------------------------------------------
router.put("/:id/edit", upload.single("image"), controller.updateListing);

// ------------------ DELETE ------------------------------------------------------

router.delete("/:id/delete", controller.deleteListing);

// -------Reserve Route-----------------------------

router.post("/:id/reserve", valiDate, controller.reserveListing);

module.exports = router;
