const User = require("../models/userModel.js");
const list = require("../models/listing.js");
const BookingDetail= require("../models/bookingDetail.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");


// -------Signup Routes----------------
module.exports.PostsignUp = async (req, res) => {
  try {
    let { Email, username, password } = req.body;
    Newuser = new User({
      email: Email,
      username: username,
    });
    let user = await User.register(Newuser, password);
    console.log(user);
    // Automatically log in the user after registration
    req.login(user, (err) => {
      if (err) {
        req.flash("error", "Login failed");
        return res.redirect("/signup");
      }
       req.flash("success", "Welcome to Housing");
       res.redirect("/listing");
    });
   
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/user/signup");
  }
} 

// Login route
module.exports.loginUser =  async (req, res) => {
    req.flash("success", "Welcome back to Housing");
    res.redirect( res.locals.redirectUrl || "/listing");
  }

//   Logout route
module.exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have logged out successfully");
    res.redirect("/listing");
  });
}


// profile route
module.exports.profile=async (req, res) => {
  let userId = req.user._id;
  let user = await User.findById(userId).populate("booking");
  if (!user) {
    req.flash("error", "User not found");
    return res.redirect("/listing");
  }
  req.flash("error", "Currently this feature is not available");
  res.redirect("/listing");
}

// booking route
module.exports.booking = async (req, res) => {
  let Ownerid = req.user._id;
  let { id } = req.params;
  let reserveData = req.body;
  data={
    listingId: id,
    checkin: reserveData.checkin, 
    checkout: reserveData.checkout,
    nights: reserveData.nights,
    price: reserveData.price,
    gst: reserveData.gst,
    totalPrice: reserveData.totalPrice,
    phone: reserveData.phone, 
  }
  const booking=new BookingDetail(data);
  
  bookingOwner = await User.findById(Ownerid);
  bookingOwner.booking.push(booking._id);
  
  await booking.save();
  await bookingOwner.save();
  
  let ReserveData =await booking.populate("listingId")
  
    res.render("user/booking", { ReserveData,bookingOwner});
  
}

// My booking
module.exports.mybooking= async (req, res) => {
  let userId = req.user._id;
  let user = await User.findById(userId).populate({ path: "booking", populate: { path: "listingId" } })
  if (!user) {
    req.flash("error", "No booking found");
    return res.redirect("/listing");
  }
  // res.send(user);
  res.render("user/mybooking", {user});
}


