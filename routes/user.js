const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/userModel.js");
const list = require("../models/listing.js");
const BookingDetail= require("../models/bookingDetail.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const userController = require("../controllers/user.controller.js");

// -------Signup Routes----------------


router.get("/signup", (req, res) => {
  res.render("user/signup");
});

router.post("/signup",userController.PostsignUp);


// -------Login and Logout Routes----------------


router.get("/login", (req, res) => {
  res.render("user/login");
});

router.post(
  "/login",saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/user/login",
    failureFlash: true,
  }),
 userController.loginUser
);


router.get("/logout",userController.logoutUser);    

// profile route
router.get("/profile", isLoggedIn, userController.profile);


//  booking route
router.post("/:id/booking",isLoggedIn, userController.booking);

// My booking

router.get("/mybooking",isLoggedIn, userController.mybooking);
module.exports = router;
